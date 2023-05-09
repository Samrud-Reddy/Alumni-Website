declare module "add" {
	export function add(): string;
}

declare module "has" {
	export function has(item: string): boolean;
}

declare module "remove" {
	export function remove(item: string): void;
}

declare module "make_random_num" {
	export function make_random_num(x?: number): string;
}
