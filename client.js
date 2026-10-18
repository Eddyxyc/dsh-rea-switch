window.__ModuleLoader__.load({
  id: 'dsh-rea-switch',
  factory(require) {
    const React = require('react');
    const h = React.createElement;
    const NS = 'rea-switch';

    const FULL = 'rea-mcp';
    const COMPACT = 'rea-compact';
    const STORAGE_KEY = 'dsh-rea-switch/variant';

    const zh = {
      tab: 'REA 压缩',
      title: 'REA 压缩',
      subtitle: '两个开关：总开关直接关闭 REA；打开后再选完整版或压缩版，两套工具不会同时运行。',
      refresh: '刷新',
      'master.label': '启用 REA',
      'master.aria': '启用或关闭 REA 工具集',
      'master.on-hint': '关闭：两行 REA 都停用，工具列表里不再出现 mcp__rea__*',
      'master.off-hint': '打开：恢复上次使用的 REA 版本',
      'switch.label': '使用压缩版 REA',
      'switch.aria': '切换 REA 压缩版',
      'switch.on-hint': '打开：启用压缩版，并停用完整版',
      'switch.off-hint': '关闭：启用完整版，并停用压缩版',
      'compress.off-hint': 'REA 已关闭：先打开上面的总开关，再选择版本',
      busy: '正在切换…',
      loading: '正在读取 REA 插件状态…',
      'error.load': '读取失败：{message}',
      'error.retry': '重试',
      'error.refresh': '刷新失败：{message}',
      unavailable: '当前连接不允许管理插件：请在桌面应用里管理此 profile。',
      'unsupported.title': '没有找到 REA 的两行配置',
      'unsupported.body': '需要 profile 的 cordis.patch.yml 同时声明 rea-mcp 与 rea-compact（见插件 README）。',
      'row.full': '完整版 rea-mcp',
      'row.compact': '压缩版 rea-compact',
      'row.active': '运行中',
      'row.idle': '已停用',
      'row.failed': '加载失败',
      'row.starting': '启动中',
      'mode.full': '当前运行：完整版（全部 REA 工具）',
      'mode.compact': '当前运行：压缩版（约 1.15 万 JSON 节点）',
      'mode.both': '两套同时在运行，token 占用最高：请关掉其中一个',
      'mode.off': '已关闭：两行 REA 都没有加载',
      'mode.unsupported': '配置不完整',
      'notice.to-compact': '已切换到压缩版 REA',
      'notice.to-full': '已切换到完整版 REA',
      'notice.to-off': '已关闭 REA',
      'notice.already-compact': '已经是压缩版了',
      'notice.already-full': '已经是完整版了',
      'notice.already-off': 'REA 已经是关闭状态',
      'notice.restart': '已保存：重启 DSH 后生效',
      'notice.overridden': '被更高优先层覆盖，未生效：{id}',
      'notice.cancelled': '操作被取消',
      'notice.failed': '切换失败：{message}',
      'notice.dismiss': '关闭提示',
      'detail.title': '底层插件行',
      hint: '关闭总开关后两行都停用，REA 的 MCP 工具会从工具列表里消失；再次打开会恢复上次选的版本。压缩版通过 REA_MCP_INPUT_SCHEMA_PROFILE=compact、REA_MCP_OUTPUT_SCHEMA_PROFILE=off 精简工具描述，适合 Command Code 这类有 32,768 节点上限的网关；本地直连 DeepSeek 时用完整版即可。',
    };

    const en = {
      tab: 'REA compression',
      title: 'REA compression',
      subtitle: 'Two switches: the master switch turns REA off outright; once it is on, pick the full or the compact build. The two never run together.',
      refresh: 'Refresh',
      'master.label': 'Enable REA',
      'master.aria': 'Enable or disable the REA tool set',
      'master.on-hint': 'Off: both REA rows are disabled and no mcp__rea__* tool is loaded',
      'master.off-hint': 'On: restore the REA variant used last',
      'switch.label': 'Use the compact REA build',
      'switch.aria': 'Toggle the compact REA build',
      'switch.on-hint': 'On: enable the compact build and disable the full one',
      'switch.off-hint': 'Off: enable the full build and disable the compact one',
      'compress.off-hint': 'REA is off: turn the master switch on first, then pick a variant',
      busy: 'Switching…',
      loading: 'Reading the REA plugin state…',
      'error.load': 'Could not read the state: {message}',
      'error.retry': 'Retry',
      'error.refresh': 'Refresh failed: {message}',
      unavailable: 'This connection cannot manage plugins: manage this profile from the desktop app.',
      'unsupported.title': 'The two REA rows are missing',
      'unsupported.body': 'The profile cordis.patch.yml must declare both rea-mcp and rea-compact (see the plugin README).',
      'row.full': 'Full build · rea-mcp',
      'row.compact': 'Compact build · rea-compact',
      'row.active': 'Running',
      'row.idle': 'Off',
      'row.failed': 'Failed',
      'row.starting': 'Starting',
      'mode.full': 'Running: the full build (every REA tool)',
      'mode.compact': 'Running: the compact build (~11.5k JSON nodes)',
      'mode.both': 'Both builds run at once, so token use is worst: turn one of them off',
      'mode.off': 'Off: neither REA row is loaded',
      'mode.unsupported': 'Incomplete configuration',
      'notice.to-compact': 'Switched to the compact REA build',
      'notice.to-full': 'Switched to the full REA build',
      'notice.to-off': 'REA is now off',
      'notice.already-compact': 'The compact build is already active',
      'notice.already-full': 'The full build is already active',
      'notice.already-off': 'REA is already off',
      'notice.restart': 'Saved: restart DSH for this to take effect',
      'notice.overridden': 'A higher-priority layer overrides this change: {id}',
      'notice.cancelled': 'The change was cancelled',
      'notice.failed': 'Switch failed: {message}',
      'notice.dismiss': 'Dismiss notice',
      'detail.title': 'Underlying plugin rows',
      hint: 'Turning the master switch off disables both rows, so the REA MCP tools disappear from the tool list; turning it back on restores the variant used last. The compact build trims the tool descriptions through REA_MCP_INPUT_SCHEMA_PROFILE=compact and REA_MCP_OUTPUT_SCHEMA_PROFILE=off, which suits gateways with a 32,768-node limit such as Command Code. Use the full build on a direct DeepSeek connection.',
    };

    const CSS = [
      '.drs-root{display:flex;flex-direction:column;gap:12px;min-height:0}',
      '.drs-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}',
      '.drs-head-text{display:flex;flex-direction:column;gap:2px;min-width:0}',
      '.drs-title{margin:0;font-size:14px;line-height:20px;font-weight:600;color:var(--dsw-alias-label-primary)}',
      '.drs-sub{margin:0;font-size:12px;line-height:18px;color:var(--dsw-alias-label-secondary)}',
      '.drs-refresh{appearance:none;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);border-radius:8px;padding:4px 10px;font:inherit;font-size:12px;line-height:18px;cursor:pointer;flex:0 0 auto}',
      '.drs-refresh:hover:not(:disabled){background:var(--dsw-alias-bg-layer-2)}',
      '.drs-refresh:disabled{opacity:.5;cursor:default}',
      '.drs-refresh:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:1px}',
      '.drs-cards{display:flex;flex-direction:column;gap:8px}',
      '.drs-card{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--dsw-alias-border-l1);border-radius:10px;background:var(--dsw-alias-bg-layer-1)}',
      '.drs-card--warn{border-color:var(--dsw-alias-state-warn-primary)}',
      '.drs-card--muted{opacity:.7}',
      '.drs-card-main{display:flex;flex-direction:column;gap:2px;flex:1;min-width:0}',
      '.drs-card-title{font-size:13px;line-height:18px;font-weight:600;color:var(--dsw-alias-label-primary)}',
      '.drs-card-sub{font-size:12px;line-height:18px;color:var(--dsw-alias-label-secondary)}',
      '.drs-switch{appearance:none;border:0;padding:0;width:38px;height:22px;border-radius:999px;background:var(--dsw-alias-border-l2);position:relative;flex:0 0 auto;cursor:pointer;transition:background .15s}',
      '.drs-switch[aria-checked="true"]{background:var(--dsw-alias-brand-primary)}',
      '.drs-switch:disabled{opacity:.4;cursor:default}',
      '.drs-switch:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:2px}',
      '.drs-knob{position:absolute;top:2px;left:2px;width:18px;height:18px;border-radius:50%;background:#fff;transition:transform .15s}',
      '.drs-switch[aria-checked="true"] .drs-knob{transform:translateX(16px)}',
      '.drs-detail{display:flex;flex-direction:column;gap:4px;padding:8px 12px;border:1px solid var(--dsw-alias-border-l1);border-radius:10px;background:var(--dsw-alias-bg-layer-1)}',
      '.drs-detail-title{font-size:11px;line-height:16px;color:var(--dsw-alias-label-secondary)}',
      '.drs-row{display:flex;align-items:center;gap:8px;font-size:12px;line-height:18px;color:var(--dsw-alias-label-primary)}',
      '.drs-row-phase{color:var(--dsw-alias-label-secondary)}',
      '.drs-dot{width:7px;height:7px;border-radius:50%;flex:0 0 auto;background:var(--dsw-alias-state-idle-primary)}',
      '.drs-dot--active{background:var(--dsw-alias-state-success-primary)}',
      '.drs-dot--failed{background:var(--dsw-alias-state-error-primary)}',
      '.drs-dot--pending,.drs-dot--loading,.drs-dot--unloading{background:var(--dsw-alias-state-warn-primary)}',
      '.drs-notice{display:flex;align-items:flex-start;gap:8px;padding:7px 10px;border-radius:8px;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);font-size:12px;line-height:18px;color:var(--dsw-alias-label-primary)}',
      '.drs-notice--ok{border-color:var(--dsw-alias-state-success-primary)}',
      '.drs-notice--warn{border-color:var(--dsw-alias-state-warn-primary)}',
      '.drs-notice--error{border-color:var(--dsw-alias-state-error-primary);color:var(--dsw-alias-state-error-primary)}',
      '.drs-notice-text{flex:1;min-width:0}',
      '.drs-notice-x{appearance:none;border:0;background:transparent;color:inherit;font:inherit;font-size:14px;line-height:14px;cursor:pointer;padding:2px}',
      '.drs-state{padding:14px 12px;border:1px solid var(--dsw-alias-border-l1);border-radius:10px;background:var(--dsw-alias-bg-layer-1);font-size:12px;line-height:18px;color:var(--dsw-alias-label-secondary);text-align:center}',
      '.drs-state--error{color:var(--dsw-alias-state-error-primary)}',
      '.drs-state-title{display:block;font-size:13px;line-height:18px;font-weight:600;color:var(--dsw-alias-label-primary);margin-bottom:4px}',
      '.drs-btn{appearance:none;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);border-radius:8px;padding:4px 10px;font:inherit;font-size:12px;line-height:18px;cursor:pointer}',
      '.drs-btn:hover{background:var(--dsw-alias-bg-layer-2)}',
      '.drs-btn:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:1px}',
      '.drs-hint{margin:0;font-size:11px;line-height:16px;color:var(--dsw-alias-label-secondary)}',
    ].join('');

    function installStyle() {
      if (typeof document === 'undefined') return () => {};
      const key = 'dsh-rea-switch/client.css';
      let tag = document.querySelector('style[data-plugin-css="' + key + '"]');
      if (tag === null) {
        tag = document.createElement('style');
        tag.dataset.pluginCss = key;
        tag.textContent = CSS;
        document.head.append(tag);
      }
      return () => {
        if (tag.parentNode !== null) tag.parentNode.removeChild(tag);
      };
    }

    function messageOf(error) {
      if (error === null || error === undefined) return 'unknown error';
      if (typeof error === 'string') return error;
      if (typeof error.message === 'string' && error.message !== '') return error.message;
      return String(error);
    }

    function remoteFailure(error) {
      return new Error(error !== null && typeof error === 'object' && typeof error.message === 'string'
        ? error.message
        : 'the Host refused the request');
    }

    function patchKey(entry) {
      if (entry === null || typeof entry !== 'object') return '';
      if (typeof entry.patchId === 'string' && entry.patchId !== '') return entry.patchId;
      const entryId = typeof entry.entryId === 'string' ? entry.entryId : '';
      return entryId.startsWith('include:') ? entryId.slice('include:'.length) : entryId;
    }

    function toRow(entry) {
      if (entry === null || entry === undefined) return null;
      return {
        entryId: entry.entryId,
        enabled: entry.enabled === true,
        phase: typeof entry.fiberPhase === 'string' ? entry.fiberPhase : null,
      };
    }

    function modeOf(full, compact) {
      if (full === null || compact === null) return 'unsupported';
      if (full.enabled && compact.enabled) return 'both';
      if (full.enabled) return 'full';
      if (compact.enabled) return 'compact';
      return 'off';
    }

    function readStoredVariant() {
      try {
        return window.localStorage.getItem(STORAGE_KEY) === 'compact' ? 'compact' : 'full';
      } catch {
        return 'full';
      }
    }

    function storeVariant(variant) {
      try {
        window.localStorage.setItem(STORAGE_KEY, variant);
      } catch {
        /* storage is optional; the in-memory copy still holds this session */
      }
    }

    class ReaSwitchController {
      constructor(ctx) {
        this.ctx = ctx;
        this.listeners = new Set();
        this.pending = null;
        this.disposed = false;
        this.lastVariant = readStoredVariant();
        this.snapshot = {
          status: 'idle',
          full: null,
          compact: null,
          busy: false,
          notice: null,
          error: null,
        };
        this.getSnapshot = this.getSnapshot.bind(this);
        this.subscribe = this.subscribe.bind(this);
      }

      getSnapshot() {
        return this.snapshot;
      }

      subscribe(listener) {
        this.listeners.add(listener);
        return () => {
          this.listeners.delete(listener);
        };
      }

      patch(change) {
        if (this.disposed) return;
        this.snapshot = { ...this.snapshot, ...change };
        for (const listener of [...this.listeners]) listener();
      }

      ensure() {
        if (this.snapshot.status === 'idle') void this.load(false);
      }

      refreshIfReady() {
        const status = this.snapshot.status;
        if (status === 'ready' || status === 'unsupported' || status === 'unavailable') void this.load(true);
      }

      dismissNotice() {
        this.patch({ notice: null });
      }

      load(silent) {
        if (this.pending !== null) return this.pending;
        const run = this.doLoad(silent === true).finally(() => {
          this.pending = null;
        });
        this.pending = run;
        return run;
      }

      async doLoad(silent) {
        if (!silent) this.patch({ status: 'loading', error: null });
        try {
          // The inventory call only hints whether this connection may manage
          // plugins; a failure there must not block the read-only listing.
          let managed = true;
          try {
            const inventory = await this.ctx.remote.pluginInventory.list();
            const info = inventory !== null && inventory.ok === true ? inventory.value : null;
            if (info !== null && typeof info === 'object' && info.managementAvailable === false) managed = false;
          } catch {
            managed = true;
          }
          if (!managed) {
            this.patch({ status: 'unavailable', full: null, compact: null });
            return;
          }
          const answer = await this.ctx.remote.pluginManager.listPlugins();
          if (!answer || answer.ok !== true) throw remoteFailure(answer === undefined ? undefined : answer.error);
          const entries = Array.isArray(answer.value) ? answer.value : [];
          const byKey = new Map();
          for (const entry of entries) byKey.set(patchKey(entry), entry);
          const full = toRow(byKey.get(FULL));
          const compact = toRow(byKey.get(COMPACT));
          this.patch({
            status: full === null || compact === null ? 'unsupported' : 'ready',
            full,
            compact,
            error: null,
          });
        } catch (error) {
          if (silent) this.patch({ notice: { kind: 'error', key: 'error.refresh', params: { message: messageOf(error) } } });
          else this.patch({ status: 'error', error: messageOf(error) });
        }
      }

      /** Master switch: off disables both rows; on restores the variant used last. */
      setReaEnabled(on) {
        if (on) return this.setMode(this.lastVariant === 'compact' ? 'compact' : 'full');
        return this.setMode('off');
      }

      /** Compression switch: on moves to the compact row, off back to the full one. */
      setCompressed(on) {
        return this.setMode(on ? 'compact' : 'full');
      }

      async setMode(target) {
        if (this.disposed || this.snapshot.busy) return;
        const full = this.snapshot.full;
        const compact = this.snapshot.compact;
        if (full === null || compact === null) return;
        const steps = [];
        if (target === 'off') {
          if (compact.enabled) steps.push([compact.entryId, false]);
          if (full.enabled) steps.push([full.entryId, false]);
        } else if (target === 'compact') {
          if (full.enabled) steps.push([full.entryId, false]);
          if (!compact.enabled) steps.push([compact.entryId, true]);
        } else {
          if (compact.enabled) steps.push([compact.entryId, false]);
          if (!full.enabled) steps.push([full.entryId, true]);
        }
        if (steps.length === 0) {
          this.patch({ notice: { kind: 'ok', key: 'notice.already-' + target } });
          return;
        }
        this.patch({ busy: true, notice: null });
        let failure = null;
        let warning = null;
        try {
          for (const step of steps) {
            const answer = await this.ctx.remote.pluginManager.setPluginEnabled(step[0], step[1]);
            if (!answer || answer.ok !== true) throw remoteFailure(answer === undefined ? undefined : answer.error);
            const result = answer.value !== null && typeof answer.value === 'object' ? answer.value : {};
            const application = typeof result.application === 'string' ? result.application : 'applied';
            if (application === 'failed') {
              const detail = result.error !== null && typeof result.error === 'object'
                ? result.error.diagnostic !== undefined ? result.error.diagnostic : result.error.code
                : undefined;
              throw new Error(detail !== undefined && detail !== null ? String(detail) : 'the Host could not apply the change');
            }
            if (application === 'cancelled') warning = { key: 'notice.cancelled' };
            else if (application === 'restart-required') warning = { key: 'notice.restart' };
            else if (application === 'overridden' && warning === null) warning = { key: 'notice.overridden', params: { id: step[0] } };
          }
        } catch (error) {
          failure = error;
        } finally {
          this.patch({ busy: false });
        }
        if (failure !== null) {
          this.patch({ notice: { kind: 'error', key: 'notice.failed', params: { message: messageOf(failure) } } });
        } else {
          if (target !== 'off') {
            this.lastVariant = target;
            storeVariant(target);
          }
          if (warning !== null) this.patch({ notice: { kind: 'warn', key: warning.key, params: warning.params } });
          else this.patch({ notice: { kind: 'ok', key: 'notice.to-' + target } });
        }
        await this.load(true);
      }

      dispose() {
        this.disposed = true;
        this.listeners.clear();
      }
    }

    function useStore(store) {
      if (typeof React.useSyncExternalStore === 'function') {
        return React.useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
      }
      const [state, setState] = React.useState(store.getSnapshot());
      React.useEffect(() => store.subscribe(() => setState(store.getSnapshot())), [store]);
      return state;
    }

    function phaseText(t, row) {
      if (row === null) return '';
      if (!row.enabled) return t('row.idle');
      if (row.phase === 'active') return t('row.active');
      if (row.phase === 'failed') return t('row.failed');
      return t('row.starting');
    }

    function rowView(t, label, row) {
      if (row === null) return null;
      const phase = row.enabled ? row.phase : null;
      return h('div', { className: 'drs-row', key: label },
        h('span', {
          className: 'drs-dot' + (phase === null ? '' : ' drs-dot--' + phase),
          'aria-hidden': 'true',
        }),
        h('span', { className: 'drs-row-name' }, t(label)),
        h('span', { className: 'drs-row-phase' }, phaseText(t, row)));
    }

    function switchView(t, aria, title, checked, disabled, onClick) {
      return h('button', {
        type: 'button',
        role: 'switch',
        className: 'drs-switch',
        'aria-checked': checked,
        'aria-label': aria,
        title,
        disabled,
        onClick,
      }, h('span', { className: 'drs-knob' }));
    }

    function ReaSwitchPage(props) {
      const t = typeof props.t === 'function' ? props.t : (key) => key;
      const controller = props.controller;
      const state = useStore(controller);
      React.useEffect(() => {
        controller.ensure();
      }, [controller]);

      const mode = modeOf(state.full, state.compact);
      const reaOn = (state.full !== null && state.full.enabled) || (state.compact !== null && state.compact.enabled);
      const compressed = state.compact !== null && state.compact.enabled === true;
      const busy = state.busy === true;
      const ready = state.status === 'ready';

      const head = h('div', { className: 'drs-head' },
        h('div', { className: 'drs-head-text' },
          h('h2', { className: 'drs-title' }, t('title')),
          h('p', { className: 'drs-sub' }, t('subtitle'))),
        h('button', {
          type: 'button',
          className: 'drs-refresh',
          disabled: state.status === 'loading' || busy,
          onClick: () => void controller.load(false),
        }, t('refresh')));

      let notice = null;
      if (state.notice !== null) {
        const params = state.notice.params === undefined ? {} : state.notice.params;
        notice = h('div', { className: 'drs-notice drs-notice--' + state.notice.kind, role: 'status' },
          h('span', { className: 'drs-notice-text' }, t(state.notice.key, params)),
          h('button', {
            type: 'button',
            className: 'drs-notice-x',
            'aria-label': t('notice.dismiss'),
            onClick: () => controller.dismissNotice(),
          }, '×'));
      }

      let card = null;
      let detail = null;
      if (state.status === 'idle' || state.status === 'loading') {
        card = h('div', { className: 'drs-state', role: 'status' }, t('loading'));
      } else if (state.status === 'unavailable') {
        card = h('div', { className: 'drs-state' }, t('unavailable'));
      } else if (state.status === 'error') {
        card = h('div', { className: 'drs-state drs-state--error', role: 'alert' },
          t('error.load', { message: state.error }),
          h('div', { style: { marginTop: '8px' } },
            h('button', { type: 'button', className: 'drs-btn', onClick: () => void controller.load(false) }, t('error.retry'))));
      } else if (state.status === 'unsupported') {
        card = h('div', { className: 'drs-state' },
          h('span', { className: 'drs-state-title' }, t('unsupported.title')),
          t('unsupported.body'));
      } else {
        card = h('div', { className: 'drs-cards' },
          h('div', { className: 'drs-card' + (mode === 'both' ? ' drs-card--warn' : ''), 'aria-busy': busy },
            h('div', { className: 'drs-card-main' },
              h('span', { className: 'drs-card-title' }, t('master.label')),
              h('span', { className: 'drs-card-sub' }, busy ? t('busy') : t('mode.' + mode))),
            switchView(
              t,
              t('master.aria'),
              reaOn ? t('master.on-hint') : t('master.off-hint'),
              reaOn,
              busy || !ready,
              () => void controller.setReaEnabled(!reaOn),
            )),
          h('div', { className: 'drs-card' + (reaOn ? '' : ' drs-card--muted'), 'aria-busy': busy },
            h('div', { className: 'drs-card-main' },
              h('span', { className: 'drs-card-title' }, t('switch.label')),
              h('span', { className: 'drs-card-sub' }, busy ? t('busy') : !reaOn ? t('compress.off-hint') : t('mode.' + mode))),
            switchView(
              t,
              t('switch.aria'),
              !reaOn ? t('compress.off-hint') : compressed ? t('switch.off-hint') : t('switch.on-hint'),
              compressed,
              busy || !ready || !reaOn,
              () => void controller.setCompressed(!compressed),
            )));
        detail = h('div', { className: 'drs-detail' },
          h('span', { className: 'drs-detail-title' }, t('detail.title')),
          rowView(t, 'row.full', state.full),
          rowView(t, 'row.compact', state.compact));
      }

      return h('div', { className: 'drs-root' },
        head,
        notice,
        card,
        detail,
        h('p', { className: 'drs-hint' }, t('hint')));
    }

    const inject = ['slots', 'locale', 'remote', 'remote.pluginManager', 'remote.pluginInventory'];

    function apply(ctx) {
      ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'rea-switch: dictionaries');
      ctx.effect(() => installStyle(), 'rea-switch: styles');
      const controller = new ReaSwitchController(ctx);
      ctx.effect(() => () => controller.dispose(), 'rea-switch: controller');
      ctx.effect(() => {
        const refresh = () => controller.refreshIfReady();
        const disposers = [
          ctx.remote.$on('plugin-manager/changed', refresh),
          ctx.on('connection/reset', refresh),
        ];
        return () => {
          for (const dispose of disposers) dispose();
        };
      }, 'rea-switch: host invalidation');
      const t = ctx.locale.bind(NS);
      ctx.slots.inject('plugins.tab', () => ctx.slots.register({
        name: 'plugins.tab',
        id: 'rea-switch',
        order: 10,
        label: () => t('tab'),
        locale: NS,
        inject: () => ({ controller }),
      }, ReaSwitchPage));
    }

    return { inject, apply };
  },
});
