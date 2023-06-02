export let States: States;
interface States {
	add(): string;
	has(x: string): boolean;
	remove(x: string): void;
}

declare module "make_random_num" {
	export function make_random_num(x?: number): string;
}
