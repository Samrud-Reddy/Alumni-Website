type reason = "ggl_jwt_token" | "my_jwt_token";

interface state_object {
	time_of_creation: number;
	used_for: reason;
	stateId: string;
}

interface State_class {
	states: state_object[];
	remove: (id: state_object | string) => void;
	makeRandomNum: (lenght?: number) => string;
	addState: (used_for: reason) => string;
	has: (id: string, used_for: reason) => boolean;
}

declare module States {
	export let States: State_class;
}
