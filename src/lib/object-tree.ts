import type { ObjectTreeOptions, ResolvedOptions } from "./types";

import chalk from "chalk";

import { renderValue } from "./handlers";

/** Default configuration */
const defaults: ResolvedOptions = {
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
const resolveOptions = (opts: ObjectTreeOptions = {}): ResolvedOptions => ({
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

/** Colorize connector character */
const connector = (char: string, opts: ResolvedOptions): string =>
	chalk.level > 0 ? chalk[opts.connectorColor](char) : char;

/**
 * Render an object as a colorized tree structure for console output.
 *
 * @example
 * ```ts
 * const tree = new ObjectTree();
 * console.log(tree.render({ name: "John", age: 30 }).join("\n"));
 * ```
 */
export class ObjectTree {
	private readonly opts: ResolvedOptions;

	constructor(options: ObjectTreeOptions = {}) {
		this.opts = resolveOptions(options);
	}

	/** Render object to array of lines */
	render(root: unknown): string[] {
		const lines: string[] = [];
		this.walk(root, lines, [], 0);
		return lines;
	}

	/** Recursively walk and render the tree */
	private walk(
		value: unknown,
		lines: string[],
		levels: boolean[],
		depth: number,
		keyLabel?: string,
		isLast?: boolean,
		divider = ": "
	): void {
		if (depth > this.opts.maxDepth) {
			return;
		}

		// Handle truncation markers
		if (typeof value === "string" && value.startsWith("+") && value.includes("more")) {
			const prefix = this.buildPrefix(levels, isLast);
			const label = keyLabel !== undefined ? `${keyLabel}${divider}` : "";
			lines.push(`${prefix}${label}${chalk.level > 0 ? chalk.gray(value) : value}`);
			return;
		}

		const result = renderValue(value, this.opts);

		// Build and push the current line
		if (keyLabel !== undefined) {
			const prefix = this.buildPrefix(levels, isLast);
			lines.push(`${prefix}${keyLabel}${divider}${result.header}`);
		} else if (this.opts.showRoot || depth > 0) {
			const prefix = this.buildPrefix(levels, isLast);
			lines.push(`${prefix}${result.header}`);
		}

		// Render children
		if (result.children && result.children.length > 0) {
			const childLevels = depth === 0 ? levels : [...levels, isLast !== true];
			const lastIndex = result.children.length - 1;

			for (const [i, child] of result.children.entries()) {
				this.walk(
					child.value,
					lines,
					childLevels,
					depth + 1,
					child.key,
					i === lastIndex,
					child.divider ?? ": "
				);
			}
		}
	}

	/** Build the prefix string for a line */
	private buildPrefix(levels: boolean[], isLast?: boolean): string {
		let prefix = "";

		// Add continuation pipes for each level
		for (const hasMoreSiblings of levels) {
			prefix += hasMoreSiblings
				? `${connector(this.opts.chars.pipe, this.opts)}${this.opts.indent}`
				: ` ${this.opts.indent}`;
		}

		// Add connector for this node
		if (isLast !== undefined) {
			prefix += isLast
				? `${connector(this.opts.chars.ell, this.opts)} `
				: `${connector(this.opts.chars.tee, this.opts)} `;
		}

		return prefix;
	}
}
