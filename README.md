# dsh-rea-switch

Plugins 页的「REA 压缩」标签：两个开关控制 REA 工具集。总开关可以直接**关闭 REA**，
打开后再用第二个开关决定用 **完整版**（`rea-mcp`）还是 **压缩版**（`rea-compact`），
两套 MCP 工具集不会同时加载。

- 「启用 REA」总开关：关 → 两行都停用（`mcp__rea__*` 工具从工具列表消失）；开 → 恢复
  上次选中的版本。
- 「使用压缩版 REA」：开 → 先停 `rea-mcp` 再启 `rea-compact`（约 1.15 万 JSON 节点 /
  210 KB，低于 Command Code 网关 32,768 节点上限）；关 → 先停 `rea-compact` 再启
  `rea-mcp`（全部 REA 工具）。
- 上次选中的版本记在浏览器 `localStorage` 的 `dsh-rea-switch/variant`，所以关闭再打开
  会回到同一个版本；换浏览器/清缓存后默认回到完整版。
- 开关状态不单独存盘，而是直接读 pluginManager 里这两行的 `enabled` 状态，所以和
  Plugins 页 / switchboard 里的手动开关完全一致。
- 两行同时启用（`both`）会显示黄色警告并提示关掉一个。

## 依赖的运行配置

开关通过 `pluginManager.setPluginEnabled()` 写 profile patch，因此 **两行 REA 必须声明在
profile 层**（`~/.dsh/profiles/desktop/cordis.patch.yml`），例如：

```yaml
- insert:
    - id: rea-mcp
      name: "@deepseek-ai/dsh-mcp-client"
      config:
        serverName: rea
        transport: stdio
        command: E:\dev\nodejs\node.exe
        args: [E:\dev\npm-global\node_modules\rea-agents\scripts\rea.mjs, mcp]
    - id: rea-compact
      name: "@deepseek-ai/dsh-mcp-client"
      disabled: true
      config:
        serverName: rea-compact
        transport: stdio
        env:
          REA_MCP_INPUT_SCHEMA_PROFILE: compact
          REA_MCP_OUTPUT_SCHEMA_PROFILE: "off"
        command: E:\dev\nodejs\node.exe
        args: [E:\dev\npm-global\node_modules\rea-agents\scripts\rea.mjs, mcp]
```

**不要**把 REA 行放进 `~/.dsh/cordis.patch.yml`（home 层）：那一层的优先级高于 profile
层，会让开关写入的 `disabled` 被覆盖，`set_plugin` 返回 `overridden`。项目首次实现时
就在这里踩过坑，已把 home 层的 REA 行迁移到 desktop profile 层。

## 安装

```powershell
# 用 plugin_manager 工具，而不是手改 package.json
plugin_manager install_bundle target=E:\项目\rea开关
```

安装后 Host 通过 HMR 挂上 `dsh.client` 声明的浏览器模块，Plugins 页会出现「REA 压缩」标签。

## 自检

```powershell
node test/probe.mjs
```

用假的 `window.__ModuleLoader__` / React / Remote 加载 `client.js`，覆盖：槽位注册、
完整版↔压缩版的调用顺序、总开关关闭（停两行）与重新打开、already 状态、`both` 冲突修复、
`overridden` / 失败 / 缺行 / 不可管理连接等分支，以及 `localStorage` 里版本偏好的记忆。

## 已知限制

- 没有可控浏览器通道，标签页的视觉渲染未目视验证；已验证的是槽位注册与控制器逻辑。
- 切换依赖 `@deepseek-ai/dsh-mcp-client` 的热插拔：命令行的 REA MCP 进程会随行停用而
  退出、随另一行启用而启动；`restart-required` 时会在提示里说明需要重启。
