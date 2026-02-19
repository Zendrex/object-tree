import type { ForegroundColorName } from "chalk";

/** Color name from chalk's foreground colors */
export type Color = ForegroundColorName;

/** Options for configuring the object tree renderer */
export interface ObjectTreeOptions {
	/** Array options */
	array?: {
		maxItems?: number;
		showLength?: boolean;
	};
	/** Characters used for tree connectors */
	chars?: {
		tee?: string;
		ell?: string;
		pipe?: string;
	};
	/** Colors for different value types */
	colors?: {
		string?: Color;
		number?: Color;
		boolean?: Color;
		null?: Color;
		undefined?: Color;
		bigint?: Color;
		symbol?: Color;
		function?: Color;
		class?: Color;
		date?: Color;
		regexp?: Color;
		array?: Color;
		object?: Color;
		set?: Color;
		map?: Color;
		instance?: Color;
	};
	/** Color for tree connector characters */
	connectorColor?: Color;
	/** Date options */
	date?: {
		format?: "none" | "iso" | "locale";
	};
	/** Indentation string per level */
	indent?: string;
	/** Map options */
	map?: {
		maxItems?: number;
		showSize?: boolean;
		divider?: string;
	};
	/** Maximum depth to render */
	maxDepth?: number;
	/** Object options */
	object?: {
		maxKeys?: number;
		sortKeys?: boolean;
	};
	/** Set options */
	set?: {
		maxItems?: number;
		showSize?: boolean;
	};
	/** Whether to show the root container */
	showRoot?: boolean;
	/** String options */
	string?: {
		maxLength?: number;
		quotes?: "single" | "double" | "none";
	};
}

/** Resolved options with all defaults applied */
export type ResolvedOptions = Required<{
	[K in keyof ObjectTreeOptions]: Required<NonNullable<ObjectTreeOptions[K]>>;
}>;

/** Result from rendering a value */
export interface RenderResult {
	children?: { key: string; value: unknown; divider?: string }[];
	header: string;
}
