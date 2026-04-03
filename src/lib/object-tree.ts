import type { ObjectTreeOptions, ResolvedOptions } from "./types";

import { colorize, renderValue } from "./handlers";
import { resolveOptions } from "./options";

/** Colorize connector character */
const connector = (char: string, opts: ResolvedOptions): string => colorize(char, opts.connectorColor);

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
			const label = keyLabel === undefined ? "" : `${keyLabel}${divider}`;
			lines.push(`${prefix}${label}${colorize(value, "gray")}`);
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
