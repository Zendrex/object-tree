import type { Color, RenderResult, ResolvedOptions } from "./types";

import chalk from "chalk";

/** Colorize text if chalk supports colors */
const colorize = (text: string, color: Color): string => {
	if (chalk.level > 0) {
		return chalk[color](text);
	}
	return text;
};

/** Check if a value is a plain object (not a class instance) */
const isPlainObject = (value: unknown): value is Record<string, unknown> => {
	if (value === null || typeof value !== "object") {
		return false;
	}
	const proto = Object.getPrototypeOf(value);
	return proto === Object.prototype || proto === null;
};

/** Check if a function is a class constructor */
const isClass = (value: unknown): boolean => {
	if (typeof value !== "function") {
		return false;
	}
	return Function.prototype.toString.call(value).startsWith("class ");
};

/** Create truncation indicator */
const truncationEntry = (remaining: number) => ({
	key: "…",
	value: `+${remaining} more`,
});

// ─────────────────────────────────────────────────────────────────────────────
// Handlers
// ─────────────────────────────────────────────────────────────────────────────

type Handler = (value: unknown, opts: ResolvedOptions) => RenderResult | null;

/** Handle null, undefined, boolean, number, bigint, symbol */
const handlePrimitive: Handler = (value, opts) => {
	if (value === null) {
		return { header: colorize("null", opts.colors.null) };
	}
	if (value === undefined) {
		return { header: colorize("undefined", opts.colors.undefined) };
	}
	if (typeof value === "boolean") {
		return { header: colorize(String(value), opts.colors.boolean) };
	}
	if (typeof value === "number") {
		const text = Number.isNaN(value) ? "NaN" : String(value);
		return { header: colorize(text, opts.colors.number) };
	}
	if (typeof value === "bigint") {
		return { header: colorize(`${value}n`, opts.colors.bigint) };
	}
	if (typeof value === "symbol") {
		return { header: colorize(String(value), opts.colors.symbol) };
	}
	return null;
};

/** Handle strings with truncation and quoting */
const handleString: Handler = (value, opts) => {
	if (typeof value !== "string") {
		return null;
	}

	const { maxLength, quotes } = opts.string;
	const truncated = value.length > maxLength ? `${value.slice(0, maxLength - 1)}…` : value;

	let text = truncated;
	if (quotes === "single") {
		text = `'${truncated}'`;
	} else if (quotes === "double") {
		text = `"${truncated}"`;
	}

	return { header: colorize(text, opts.colors.string) };
};

/** Handle arrays */
const handleArray: Handler = (value, opts) => {
	if (!Array.isArray(value)) {
		return null;
	}

	const { maxItems, showLength } = opts.array;
	const len = value.length;
	const toShow = Math.min(len, maxItems);

	const children: RenderResult["children"] = [];
	for (let i = 0; i < toShow; i += 1) {
		children.push({ key: String(i), value: value[i] });
	}
	if (toShow < len) {
		children.push(truncationEntry(len - toShow));
	}

	const label = showLength ? `Array(${len})` : "Array";
	return { header: colorize(label, opts.colors.array), children };
};

/** Handle Set */
const handleSet: Handler = (value, opts) => {
	if (!(value instanceof Set)) {
		return null;
	}

	const { maxItems, showSize } = opts.set;
	const size = value.size;
	const toShow = Math.min(size, maxItems);

	const children: RenderResult["children"] = [];
	let i = 0;
	for (const item of value) {
		if (i >= toShow) {
			break;
		}
		children.push({ key: String(i), value: item });
		i += 1;
	}
	if (toShow < size) {
		children.push(truncationEntry(size - toShow));
	}

	const label = showSize ? `Set(${size})` : "Set";
	return { header: colorize(label, opts.colors.set), children };
};

/** Handle Map */
const handleMap: Handler = (value, opts) => {
	if (!(value instanceof Map)) {
		return null;
	}

	const { maxItems, showSize, divider } = opts.map;
	const size = value.size;
	const toShow = Math.min(size, maxItems);

	const children: RenderResult["children"] = [];
	let i = 0;
	for (const [k, v] of value) {
		if (i >= toShow) {
			break;
		}
		children.push({ key: String(k), value: v, divider });
		i += 1;
	}
	if (toShow < size) {
		children.push(truncationEntry(size - toShow));
	}

	const label = showSize ? `Map(${size})` : "Map";
	return { header: colorize(label, opts.colors.map), children };
};

/** Handle functions (not class constructors) */
const handleFunction: Handler = (value, opts) => {
	if (typeof value !== "function" || isClass(value)) {
		return null;
	}

	const name = value.name || "anonymous";
	return { header: colorize(`Function(${name})`, opts.colors.function) };
};

/** Handle class constructors */
const handleClass: Handler = (value, opts) => {
	if (!isClass(value)) {
		return null;
	}

	const fn = value as { name?: string };
	const name = fn.name || "anonymous";
	return { header: colorize(`Class(${name})`, opts.colors.class) };
};

/** Handle Date instances */
const handleDate: Handler = (value, opts) => {
	if (!(value instanceof Date)) {
		return null;
	}

	const { format } = opts.date;
	let body = "Date()";
	if (format === "iso") {
		body = `Date(${value.toISOString()})`;
	} else if (format === "locale") {
		body = `Date(${value.toLocaleString()})`;
	}

	return { header: colorize(body, opts.colors.date) };
};

/** Handle RegExp instances */
const handleRegExp: Handler = (value, opts) => {
	if (!(value instanceof RegExp)) {
		return null;
	}
	return { header: colorize(value.toString(), opts.colors.regexp) };
};

/** Handle plain objects */
const handleObject: Handler = (value, opts) => {
	if (!isPlainObject(value)) {
		return null;
	}

	const { maxKeys, sortKeys } = opts.object;
	let keys = Object.keys(value);
	if (sortKeys) {
		keys = keys.sort();
	}

	const toShow = Math.min(keys.length, maxKeys);
	const children: RenderResult["children"] = [];
	for (let i = 0; i < toShow; i += 1) {
		const k = keys[i];
		if (k !== undefined) {
			children.push({ key: k, value: value[k] });
		}
	}
	if (toShow < keys.length) {
		children.push(truncationEntry(keys.length - toShow));
	}

	return { header: colorize("Object{}", opts.colors.object), children };
};

/** Handle class instances (non-plain objects) */
const handleInstance: Handler = (value, opts) => {
	if (value === null || typeof value !== "object") {
		return null;
	}
	if (isPlainObject(value)) {
		return null;
	}
	// Skip built-ins handled by other handlers
	if (
		value instanceof Date ||
		value instanceof RegExp ||
		value instanceof Set ||
		value instanceof Map ||
		Array.isArray(value)
	) {
		return null;
	}

	const ctorName = (value.constructor as { name?: string })?.name || "Object";
	const ownKeys = Object.keys(value);
	const toShow = Math.min(ownKeys.length, opts.object.maxKeys);

	const children: RenderResult["children"] = [];
	for (let i = 0; i < toShow; i += 1) {
		const k = ownKeys[i];
		if (k !== undefined) {
			children.push({ key: k, value: (value as Record<string, unknown>)[k] });
		}
	}
	if (toShow < ownKeys.length) {
		children.push(truncationEntry(ownKeys.length - toShow));
	}

	return { header: colorize(`${ctorName}{}`, opts.colors.instance), children };
};

// ─────────────────────────────────────────────────────────────────────────────
// Handler chain - order matters (more specific first)
// ─────────────────────────────────────────────────────────────────────────────

const handlers: Handler[] = [
	handlePrimitive,
	handleString,
	handleDate,
	handleRegExp,
	handleArray,
	handleSet,
	handleMap,
	handleFunction,
	handleClass,
	handleInstance,
	handleObject, // Catch-all for plain objects
];

/** Render a value using the first matching handler */
export const renderValue = (value: unknown, opts: ResolvedOptions): RenderResult => {
	for (const handler of handlers) {
		const result = handler(value, opts);
		if (result) {
			return result;
		}
	}
	return { header: "Unknown" };
};
