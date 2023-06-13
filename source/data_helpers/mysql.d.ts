export interface user_interface {
	name: string;
	email: string;
	gradyear: number;
	college: string;
	major: string;
	job?: string;
	country: string;
	city: string;
	mentor: boolean;
}

declare module "verifyAndAddUser" {
	export function verifyAndAddUser(user: user_interface): Promise<string[]>;
}
