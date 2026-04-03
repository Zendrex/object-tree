/** biome-ignore-all lint/performance/noBarrelFile: main index file */
export type { Color, ObjectTreeOptions, RenderResult, ResolvedOptions } from "./lib/types";

export { renderValue } from "./lib/handlers";
export { ObjectTree } from "./lib/object-tree";
export { resolveOptions } from "./lib/options";
