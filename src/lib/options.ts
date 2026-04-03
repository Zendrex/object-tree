import type { ObjectTreeOptions, ResolvedOptions } from "./types";

/** Default configuration */
export const defaults: ResolvedOptions = {
	chars: { tee: "├─", ell: "└─", pipe: "│" },
	connectorColor: "gray",
	indent: "  ",
	maxDepth: Number.POSITIVE_INFINITY,
	showRoot: false,
	colors: {
		string: "green",
		number: "cyan",
		boolean: "yellow",
		null: "red",
		undefined: "gray",
		bigint: "cyan",
		symbol: "magenta",
		function: "gray",
		class: "cyan",
		date: "magenta",
		regexp: "red",
		array: "yellow",
		object: "cyan",
		set: "green",
		map: "blue",
		instance: "cyan",
	},
	string: { maxLength: 80, quotes: "double" },
	array: { maxItems: Number.POSITIVE_INFINITY, showLength: true },
	object: { maxKeys: Number.POSITIVE_INFINITY, sortKeys: true },
	set: { maxItems: Number.POSITIVE_INFINITY, showSize: true },
	map: { maxItems: Number.POSITIVE_INFINITY, showSize: true, divider: " → " },
	date: { format: "none" },
};

/** Merge user options with defaults */
export const resolveOptions = (opts: ObjectTreeOptions = {}): ResolvedOptions => ({
	chars: { ...defaults.chars, ...opts.chars },
	connectorColor: opts.connectorColor ?? defaults.connectorColor,
	indent: opts.indent ?? defaults.indent,
	maxDepth: opts.maxDepth ?? defaults.maxDepth,
	showRoot: opts.showRoot ?? defaults.showRoot,
	colors: { ...defaults.colors, ...opts.colors },
	string: { ...defaults.string, ...opts.string },
	array: { ...defaults.array, ...opts.array },
	object: { ...defaults.object, ...opts.object },
	set: { ...defaults.set, ...opts.set },
	map: { ...defaults.map, ...opts.map },
	date: { ...defaults.date, ...opts.date },
});
