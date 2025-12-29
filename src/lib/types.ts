import type { ForegroundColorName } from "chalk";

/** Color name from chalk's foreground colors */
export type Color = ForegroundColorName;

/** Options for configuring the object tree renderer */
export type ObjectTreeOptions = {
	/** Characters used for tree connectors */
	chars?: {
		tee?: string;
		ell?: string;
		pipe?: string;
	};
	/** Color for tree connector characters */
	connectorColor?: Color;
	/** Indentation string per level */
	indent?: string;
	/** Maximum depth to render */
	maxDepth?: number;
	/** Whether to show the root container */
	showRoot?: boolean;
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
	/** String options */
	string?: {
		maxLength?: number;
		quotes?: "single" | "double" | "none";
	};
	/** Array options */
	array?: {
		maxItems?: number;
		showLength?: boolean;
	};
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
	/** Map options */
	map?: {
		maxItems?: number;
		showSize?: boolean;
		divider?: string;
	};
	/** Date options */
	date?: {
		format?: "none" | "iso" | "locale";
	};
};

/** Resolved options with all defaults applied */
export type ResolvedOptions = Required<{
	[K in keyof ObjectTreeOptions]: Required<NonNullable<ObjectTreeOptions[K]>>;
}>;

/** Result from rendering a value */
export type RenderResult = {
	header: string;
	children?: { key: string; value: unknown; divider?: string }[];
};
