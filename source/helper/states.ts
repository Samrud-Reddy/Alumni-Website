import fs from "fs";

function readStates(): string[] {
	const contents = fs.readFileSync(
		require.main?.path + "\\states.json",
		"utf-8"
	);
	const data = JSON.parse(contents);

	if (!Array.isArray(data)) {
		throw new Error("JSON file does not contain a list");
	}

	return data;
}

function appendStates(x: string): void {
	let states = readStates();

	states.push(x);

	let json = JSON.stringify(states);

	fs.writeFile(require.main?.path + "\\states.json", json, (err) => {
		if (err) throw err;
	});
}

function write(x: string): void {
	fs.writeFile(require.main?.path + "\\states.json", x, (err) => {
		if (err) throw err;
	});
}

export function add(x: string): void {
	appendStates(x);
}

export function has(x: string): boolean {
	let states = readStates();
	return states.includes(x);
}

export function remove(x: string): void {
	let states = readStates();

	states = states.filter((item: string) => item !== x);
	write(JSON.stringify(states));
}
