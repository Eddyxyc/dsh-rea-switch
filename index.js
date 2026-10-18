/**
 * Host half of dsh-rea-switch.
 *
 * The switch itself is a Web UI plugin: this row only mounts the browser
 * module declared in `dsh.client`, so it stays inert outside the Web UI and
 * registers no Host service, command, or tool.
 */

export const name = 'rea-switch';

export function apply() {}
