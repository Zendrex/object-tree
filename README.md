# @zendrex/object-tree

Render objects as colorized tree structures in the console, with customizable formatting and type-aware styling.

## Example

Here's the basic pattern:

```ts
import { ObjectTree } from "@zendrex/object-tree";

const tree = new ObjectTree({
  maxDepth: 3,
  showRoot: true,
  colors: {
    string: "green",
    number: "cyan",
    object: "cyan",
  },
  string: { maxLength: 50 },
  array: { maxItems: 5 },
});

const data = {
  name: "John Doe",
  age: 30,
  hobbies: ["reading", "coding", "gaming"],
  address: {
    city: "New York",
    coordinates: { lat: 40.7128, lng: -74.006 },
  },
  tags: new Set(["developer", "typescript"]),
};

const lines = tree.render(data);
console.log(lines.join("\n"));
```

Output:
```
├─ name: "John Doe"
├─ age: 30
├─ hobbies: Array(3)
│  ├─ 0: "reading"
│  ├─ 1: "coding"
│  └─ 2: "gaming"
├─ address: Object
│  ├─ city: "New York"
│  └─ coordinates: Object
│     ├─ lat: 40.7128
│     └─ lng: -74.006
└─ tags: Set(2)
   ├─ "developer"
   └─ "typescript"
```

## How it works

### Type-aware rendering

The library detects and handles all JavaScript types with specialized formatting:

**Primitives**: strings (with quote styles), numbers, booleans, null, undefined, bigints, symbols

**Collections**: objects, arrays, Maps, Sets—each with configurable size limits and display options

**Special types**: dates (with format options), RegExp, functions, class constructors, and class instances

Each type can be assigned a custom color and has type-specific formatting options.

### Customizable output

Control the visual appearance with extensive options:

```ts
const tree = new ObjectTree({
  // Tree structure
  chars: { tee: "├─", ell: "└─", pipe: "│" },
  indent: "  ",
  connectorColor: "gray",
  maxDepth: 5,
  showRoot: false,
  
  // Type colors
  colors: {
    string: "green",
    number: "cyan",
    boolean: "yellow",
    // ... more type colors
  },
  
  // Type-specific options
  string: { maxLength: 80, quotes: "double" },
  array: { maxItems: 10, showLength: true },
  object: { maxKeys: 20, sortKeys: true },
  set: { maxItems: 10, showSize: true },
  map: { maxItems: 10, showSize: true, divider: " → " },
  date: { format: "locale" }, // "none" | "iso" | "locale"
});
```

### Truncation

When limits are exceeded, the library automatically truncates with helpful indicators:

```ts
// Arrays show truncation
hobbies: Array(10)
├─ 0: "reading"
├─ 1: "coding"
└─ +8 more items

// Strings are truncated with ellipsis
description: "This is a very long string that will be trunca..."
```

## API overview

### Constructor

- `new ObjectTree(options?)` — create a tree renderer with optional configuration

### Configuration Options

**Structure:**
- `chars` — tree characters (`tee`, `ell`, `pipe`)
- `indent` — indentation string (default: `"  "`)
- `connectorColor` — color for tree connectors (default: `"gray"`)
- `maxDepth` — maximum nesting depth (default: `Infinity`)
- `showRoot` — whether to show the root value label (default: `false`)

**Colors:**
- `colors` — object mapping type names to chalk color strings

**Type-specific:**
- `string` — `{ maxLength, quotes }`
- `array` — `{ maxItems, showLength }`
- `object` — `{ maxKeys, sortKeys }`
- `set` — `{ maxItems, showSize }`
- `map` — `{ maxItems, showSize, divider }`
- `date` — `{ format }` (`"none"` | `"iso"` | `"locale"`)

### Methods

- `tree.render(value)` — render any value to an array of strings

## Running the example

```bash
bun install
bun run examples/basic-example.ts
```

## License

MIT
