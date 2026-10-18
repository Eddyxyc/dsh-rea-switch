// Loads client.js under a fake browser module loader and exercises the
// REA compression controller against fake Remote services.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../client.js', import.meta.url), 'utf8');

let loaded = null;
const storage = new Map();
globalThis.window = {
  __ModuleLoader__: {
    load(spec) {
      loaded = spec;
    },
  },
  localStorage: {
    getItem: (key) => (storage.has(key) ? storage.get(key) : null),
    setItem: (key, value) => storage.set(key, String(value)),
  },
};

const React = {
  createElement: (...args) => ({ args }),
  useState: (initial) => [initial, () => {}],
  useEffect: () => {},
  useCallback: (fn) => fn,
  useMemo: (fn) => fn(),
  useRef: (value) => ({ current: value }),
  useSyncExternalStore: () => null,
};

// eslint-disable-next-line no-new-func
new Function('window', source)(globalThis.window);

assert.equal(loaded.id, 'dsh-rea-switch', 'loader id is the package name');
const module = loaded.factory((name) => {
  assert.equal(name, 'react');
  return React;
});
assert.deepEqual(module.inject, ['slots', 'locale', 'remote', 'remote.pluginManager', 'remote.pluginInventory']);

function makeEntries(overrides = {}) {
  return [
    {
      entryId: 'include:rea-mcp',
      moduleName: '@deepseek-ai/dsh-mcp-client',
      patchId: 'rea-mcp',
      enabled: overrides.fullEnabled === undefined ? true : overrides.fullEnabled,
      fiberPhase: overrides.fullEnabled === false ? null : 'active',
    },
    {
      entryId: 'include:rea-compact',
      moduleName: '@deepseek-ai/dsh-mcp-client',
      patchId: 'rea-compact',
      enabled: overrides.compactEnabled === undefined ? false : overrides.compactEnabled,
      fiberPhase: overrides.compactEnabled === true ? 'active' : null,
    },
    { entryId: 'include:unrelated', moduleName: 'dsh-other', patchId: 'unrelated', enabled: true, fiberPhase: 'active' },
  ];
}

function makeCtx(options = {}) {
  const calls = { listPlugins: 0, setPluginEnabled: [], effects: [], disposers: [] };
  const entries = makeEntries(options.entries === undefined ? {} : options.entries);
  const ctx = {
    effect(fn) {
      const dispose = fn();
      calls.effects.push(dispose);
      return dispose;
    },
    locale: {
      register(namespace, dictionaries) {
        calls.namespace = namespace;
        calls.dictionaries = dictionaries;
        return () => {};
      },
      bind() {
        return (key, params) => {
          const template = calls.dictionaries.zh[key] === undefined ? key : calls.dictionaries.zh[key];
          if (params === undefined) return template;
          return template.replace(/\{(\w+)\}/g, (match, name) => (params[name] === undefined ? match : String(params[name])));
        };
      },
    },
    slots: {
      inject(name, producer) {
        calls.slotName = name;
        return producer();
      },
      register(definition, component) {
        calls.definition = definition;
        calls.component = component;
        return () => {};
      },
    },
    on() {
      return () => {};
    },
    remote: {
      $on() {
        return () => {};
      },
      pluginManager: {
        async listPlugins() {
          calls.listPlugins += 1;
          if (options.listError !== undefined) return { ok: false, error: { message: options.listError } };
          if (options.missingRows === true) {
            return { ok: true, value: entries.filter((entry) => entry.patchId === 'unrelated') };
          }
          return { ok: true, value: entries };
        },
        async setPluginEnabled(entryId, enabled) {
          calls.setPluginEnabled.push([entryId, enabled]);
          if (options.toggleError !== undefined) return { ok: false, error: { message: options.toggleError } };
          const entry = entries.find((item) => item.entryId === entryId);
          if (entry !== undefined) {
            entry.enabled = enabled;
            entry.fiberPhase = enabled ? 'active' : null;
          }
          return {
            ok: true,
            value: {
              application: options.application === undefined ? 'applied' : options.application,
              restartReason: 'no-hmr',
            },
          };
        },
      },
      pluginInventory: {
        async list() {
          if (options.inventoryError !== undefined) return { ok: false, error: { message: options.inventoryError } };
          return { ok: true, value: { managementAvailable: options.managementAvailable !== false } };
        },
      },
    },
  };
  return { ctx, calls };
}

const { ctx, calls } = makeCtx();
module.apply(ctx);
assert.equal(calls.slotName, 'plugins.tab');
assert.equal(calls.definition.name, 'plugins.tab');
assert.equal(calls.definition.id, 'rea-switch');
assert.equal(calls.definition.order, 10);
assert.equal(calls.definition.locale, 'rea-switch');
assert.equal(calls.namespace, 'rea-switch');
assert.equal(calls.dictionaries.zh.tab, 'REA 压缩');
assert.equal(calls.dictionaries.en.tab, 'REA compression');
assert.equal(typeof calls.definition.label, 'function');
assert.equal(calls.definition.label(), 'REA 压缩', 'tab label resolves through the bound locale');

const controller = calls.definition.inject().controller;
assert.equal(controller.getSnapshot().status, 'idle');

await controller.load(false);
let state = controller.getSnapshot();
assert.equal(state.status, 'ready');
assert.equal(state.full.entryId, 'include:rea-mcp');
assert.equal(state.full.enabled, true);
assert.equal(state.compact.enabled, false);
assert.equal(calls.listPlugins, 1);

// full -> compact: disable the full row first, then enable the compact one.
await controller.setCompressed(true);
assert.deepEqual(calls.setPluginEnabled, [['include:rea-mcp', false], ['include:rea-compact', true]]);
state = controller.getSnapshot();
assert.equal(state.full.enabled, false);
assert.equal(state.compact.enabled, true);
assert.equal(state.busy, false);
assert.equal(state.notice.kind, 'ok');
assert.equal(state.notice.key, 'notice.to-compact');
assert.equal(calls.listPlugins, 2, 'the controller reloads after a change');

// compact -> full: disable the compact row first, then enable the full one.
calls.setPluginEnabled.length = 0;
await controller.setCompressed(false);
assert.deepEqual(calls.setPluginEnabled, [['include:rea-compact', false], ['include:rea-mcp', true]]);
state = controller.getSnapshot();
assert.equal(state.full.enabled, true);
assert.equal(state.compact.enabled, false);
assert.equal(state.notice.key, 'notice.to-full');

// Already in the requested mode: nothing reaches the Host.
calls.setPluginEnabled.length = 0;
await controller.setCompressed(false);
assert.deepEqual(calls.setPluginEnabled, []);
state = controller.getSnapshot();
assert.equal(state.notice.kind, 'ok');
assert.equal(state.notice.key, 'notice.already-full');

// Both rows enabled at once is reported, and turning the switch on fixes it.
const both = makeCtx({ entries: { fullEnabled: true, compactEnabled: true } });
module.apply(both.ctx);
const bothController = both.calls.definition.inject().controller;
await bothController.load(false);
assert.equal(bothController.getSnapshot().full.enabled, true);
assert.equal(bothController.getSnapshot().compact.enabled, true);
await bothController.setCompressed(true);
assert.deepEqual(both.calls.setPluginEnabled, [['include:rea-mcp', false]]);

// A Host that answers overridden produces a warning, not an error.
const overridden = makeCtx({ application: 'overridden' });
module.apply(overridden.ctx);
const overriddenController = overridden.calls.definition.inject().controller;
await overriddenController.load(false);
await overriddenController.setCompressed(true);
state = overriddenController.getSnapshot();
assert.equal(state.notice.kind, 'warn');
assert.equal(state.notice.key, 'notice.overridden');
assert.equal(state.notice.params.id, 'include:rea-mcp');

// A Remote failure surfaces as an error notice.
const failing = makeCtx({ toggleError: 'nope' });
module.apply(failing.ctx);
const failingController = failing.calls.definition.inject().controller;
await failingController.load(false);
await failingController.setCompressed(true);
assert.equal(failingController.getSnapshot().notice.kind, 'error');
assert.equal(failingController.getSnapshot().notice.key, 'notice.failed');
assert.equal(failingController.getSnapshot().notice.params.message, 'nope');
assert.deepEqual(failingController.getSnapshot().busy, false);

// Missing rows never reach the Host and show the unsupported state.
const missing = makeCtx({ missingRows: true });
module.apply(missing.ctx);
const missingController = missing.calls.definition.inject().controller;
await missingController.load(false);
assert.equal(missingController.getSnapshot().status, 'unsupported');
assert.equal(missingController.getSnapshot().full, null);
await missingController.setCompressed(true);
assert.deepEqual(missing.calls.setPluginEnabled, []);

// An unmanaged connection never lists plugins and shows the unavailable state.
const unavailable = makeCtx({ managementAvailable: false });
module.apply(unavailable.ctx);
const unavailableController = unavailable.calls.definition.inject().controller;
await unavailableController.load(false);
assert.equal(unavailableController.getSnapshot().status, 'unavailable');
assert.equal(unavailable.calls.listPlugins, 0);

// A listing failure shows the error state and keeps the retry path usable.
const broken = makeCtx({ listError: 'boom' });
module.apply(broken.ctx);
const brokenController = broken.calls.definition.inject().controller;
await brokenController.load(false);
assert.equal(brokenController.getSnapshot().status, 'error');
assert.equal(brokenController.getSnapshot().error, 'boom');

// Master switch: off disables the running row; on restores the variant used last.
storage.clear();
const master = makeCtx();
module.apply(master.ctx);
const masterController = master.calls.definition.inject().controller;
await masterController.load(false);
await masterController.setReaEnabled(false);
assert.deepEqual(master.calls.setPluginEnabled, [['include:rea-mcp', false]]);
state = masterController.getSnapshot();
assert.equal(state.full.enabled, false);
assert.equal(state.notice.key, 'notice.to-off');
await masterController.setReaEnabled(false);
assert.deepEqual(master.calls.setPluginEnabled, [['include:rea-mcp', false]]);
assert.equal(masterController.getSnapshot().notice.key, 'notice.already-off');
await masterController.setReaEnabled(true);
assert.deepEqual(master.calls.setPluginEnabled, [['include:rea-mcp', false], ['include:rea-mcp', true]]);
assert.equal(masterController.getSnapshot().notice.key, 'notice.to-full');

// Turning REA off while the compact build runs disables that row, and the
// chosen variant is remembered across controller instances.
await masterController.setCompressed(true);
assert.equal(storage.get('dsh-rea-switch/variant'), 'compact');
const reboot = makeCtx({ entries: { fullEnabled: false, compactEnabled: false } });
module.apply(reboot.ctx);
const rebootController = reboot.calls.definition.inject().controller;
await rebootController.load(false);
assert.equal(rebootController.getSnapshot().full.enabled, false);
assert.equal(rebootController.getSnapshot().compact.enabled, false);
await rebootController.setReaEnabled(true);
assert.deepEqual(reboot.calls.setPluginEnabled, [['include:rea-compact', true]]);
assert.equal(rebootController.getSnapshot().notice.key, 'notice.to-compact');

// Unloading disposes the controller; later calls are no-ops.
controller.dispose();
const before = calls.setPluginEnabled.length;
await controller.setCompressed(true);
assert.equal(calls.setPluginEnabled.length, before);

console.log('PASS rea-switch probe');
