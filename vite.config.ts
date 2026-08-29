// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

/**
 * The dev-only devtools plugin injects a `data-tsd-source` attribute into every
 * JSX element. react-three-fiber elements (<mesh />, <sphereGeometry />, ...)
 * are not DOM nodes and throw when an unknown string prop is applied.
 * This plugin strips that attribute from R3F scene files.
 */
const stripTsdSourceFromR3F = () => ({
  name: "strip-tsd-source-from-r3f",
  enforce: "post" as const,
  apply: "serve" as const,
  transform(code: string, id: string) {
    if (!/\.(t|j)sx$/.test(id.split("?")[0]!)) return null;
    if (!code.includes("data-tsd-source")) return null;
    if (!/three|@react-three/.test(code)) return null;
    return {
      code: code.replace(/\s*"data-tsd-source":\s*"[^"]*",?/g, "").replace(/\s*data-tsd-source="[^"]*"/g, ""),
      map: null,
    };
  },
});

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    plugins: [stripTsdSourceFromR3F()],
  },
});
