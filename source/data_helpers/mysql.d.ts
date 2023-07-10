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

declare module "isTeacher" {
	export function isTeacher(email: string): Promise<boolean>;
}

declare module "isAlumini" {
	export function isAlumini(email: string): Promise<boolean>;
}

export interface searchParameters {
	name?: string;
	gradyear?: number;
	college?: string;
	major?: string;
	job?: string;
	country?: string;
	city?: string;
}

import {Knex} from "knex";

declare module "findAlumni" {
	export function findAlumni(
		searchParams: searchParameters
	): Promise<Knex.QueryBuilder>;
}

declare module "getAll" {
	export function getAll(): Promise<any[]>;
}
