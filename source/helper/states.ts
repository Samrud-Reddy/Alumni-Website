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

import {getRandomValues, createHash} from "crypto";
export function make_random_num(x?: number): string {
	let state: string;
	let randomnumber = getRandomValues(new BigInt64Array(x || 16));

	state =
		createHash("sha256")
			.update(randomnumber.slice(0, randomnumber.length / 2).toString())
			.digest("base64url")
			.toString() +
		createHash("sha256")
			.update(
				randomnumber
					.slice(randomnumber.length / 2, randomnumber.length)
					.toString()
			)
			.digest("base64url")
			.toString();

	return state;
}

interface States {
	add(): string;
	has(x: string): boolean;
	remove(x: string): void;
}

export let States: States = {
	add(): string {
		let x = make_random_num(16);
		appendStates(x);
		return x;
	},
	has(x: string): boolean {
		let states = readStates();
		return states.includes(x);
	},
	remove(x: string): void {
		let states = readStates();

		states = states.filter((item: string) => item !== x);
		write(JSON.stringify(states));
	},
};
