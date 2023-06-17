import {getRandomValues, createHash} from "crypto";

function make_random_num(x?: number): string {
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

//update declarations if changes are made
type reason = "ggl_jwt_token" | "my_jwt_token";

interface state_object {
	time_of_creation: number;
	used_for: reason;
	stateId: string;
}

export class State_class {
	states: state_object[] = [];

	public remove(id: state_object | string): void {
		let index: number;

		if (typeof id === "object") {
			index = this.states.indexOf(id);
		}

		if (typeof id === "string") {
			for (let item of this.states) {
				if (item.stateId === id) {
					index = this.states.indexOf(item);
					break;
				}
			}
		}

		this.states.filter((state, i) => i !== index);
	}

	public makeRandomNum(lenght?: number): string {
		return make_random_num(lenght);
	}

	public addState(used_for: reason): string {
		let id = this.makeRandomNum(16);

		let stateOBJ: state_object = {
			time_of_creation: Date.now(),
			used_for: used_for,
			stateId: id,
		};

		this.states.push(stateOBJ);

		return id;
	}

	public has(id: string, used_for: reason): boolean {
		let inStates = false;
		let toRemove: state_object[] = [];
		for (let i = 0; i < this.states.length; i++) {
			let currentStateObj: state_object = this.states[i];

			let lifeTime = Date.now() - currentStateObj.time_of_creation;

			if (lifeTime >= 10 * 60 * 1000) {
				toRemove.push(this.states[i]);
			} else if (
				currentStateObj.stateId === id &&
				currentStateObj.used_for === used_for
			) {
				inStates = true;
			}
		}

		toRemove.forEach((element: state_object) => {
			this.remove(element);
		});

		return inStates;
	}
}

export let States: State_class = new State_class();
