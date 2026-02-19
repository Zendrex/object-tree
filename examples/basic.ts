import { ObjectTree } from "../src/index";

const tree = new ObjectTree({
	connectorColor: "gray",
	indent: "  ",
	maxDepth: 3,
	showRoot: true,
	colors: {
		array: "yellow",
		date: "magenta",
		object: "cyan",
		string: "green",
	},
	string: { maxLength: 50 },
	array: { maxItems: 5 },
	object: { maxKeys: 10 },
	date: { format: "locale" },
});

const sampleData = {
	address: {
		city: "New York",
		coordinates: {
			lat: 40.7128,
			lng: -74.006,
		},
		country: "USA",
		street: "123 Main St",
	},
	age: 30,
	bigNumber: 12345678901234567890n,
	birthDate: new Date("1993-05-15"),
	ClassConstructor: class Person {
		name: string;

		constructor(name: string) {
			this.name = name;
		}
	},
	fn(name: string) {
		return `Hello, ${name}!`;
	},
	hobbies: ["reading", "coding", "gaming", "cooking", "traveling"],
	isActive: true,
	name: "John Doe",
	nullValue: null,
	regex: /^[a-zA-Z0-9]+$/,
	scores: new Map([
		["math", 95],
		["science", 87],
		["english", 92],
	]),
	symbol: Symbol("unique"),
	tags: new Set(["developer", "typescript", "nodejs"]),
	undefinedValue: undefined,
};

const lines = tree.render(sampleData);
// biome-ignore lint/suspicious/noConsole: example
console.log(lines.join("\n"));
