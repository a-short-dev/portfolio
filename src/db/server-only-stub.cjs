/**
 * Stub that neutralizes `server-only` when running seed/migration scripts
 * outside of the Next.js runtime (e.g. via `tsx` directly).
 *
 * `server-only` works by exporting a conditional export that only resolves
 * in a `react-server` environment. Outside Next.js, the module is simply
 * missing, so we register a no-op shim before the real module loader runs.
 */
const Module = require('node:module');
const originalLoad = Module._load;

Module._load = function (request, parent, isMain) {
  if (request === 'server-only') {
    return {}; // no-op shim
  }
  return originalLoad.call(this, request, parent, isMain);
};
