declare module "parseJwt" {
	export function parseJwt(token: string): string;
}

declare module "get_token_from_ggl" {
	export function get_token_from_ggl(token: string): Promise<any>;
}

declare module "verify_google_JWT" {
	export function verify_google_JWT(token: string): Promise<any>;
}
