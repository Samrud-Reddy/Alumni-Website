import {Knex} from "knex";
import {RowDataPacket} from "mysql2";

require("dotenv").config();

const knex: Knex = require("knex")({
	client: "mysql",
	connection: {
		host: process.env.SQL_host || "localhost",
		port: process.env.SQL_PORT || "3306",
		user: "root",
		password: process.env.SQL_pwd || "1xd`1ox0Vk",
		database: process.env.SQL_database_name || "alumini_website",
	},
});

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

export async function verifyAndAddUser(user: user_interface): Promise<string> {
	return knex("users")
		.select("*")
		.where({email: user.email})
		.then((rows: RowDataPacket[]) => {
			if (rows.length !== 0) {
				return "USER_EXISTS";
			}

			let resultOfSQL: any = knex("users").insert(user);
			return resultOfSQL.then((rows: RowDataPacket[]) => {
				return "redirect";
			});
		});
}

export async function isTeacher(email: string): Promise<boolean> {
	let teachers = knex("teachers").select("*").where({email: email});

	return teachers.then((rows) => {
		return rows.length > 0;
	});
}

export async function isAlumini(email: string): Promise<boolean> {
	let teachers = knex("users").select("*").where({email: email});

	return teachers.then((rows) => {
		return rows.length > 0;
	});
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

export async function findAlumni(
	searchParams: searchParameters
): Promise<Knex.QueryBuilder> {
	let fixedParms: any[][] = [];
	let key: keyof searchParameters;
	for (key in searchParams) {
		if (searchParams[key] !== "") {
			fixedParms.push([key, searchParams[key]]);
		}
	}

	function andWhere(this: Knex.QueryBuilder) {
		for (let i in fixedParms) {
			let param = fixedParms[i];
			this.orWhere(param[0], param[1]);
		}
	}

	let results = knex("users")
		.select("*")
		.where({mentor: true})
		.andWhere(andWhere);

	return await results;
}

export async function getAllForCache(ord: number): Promise<any[]> {
	return await knex("users")
		.select("id", "name", "college", "major", "job", "country", "city")
		.where("id", ">", ord);
}
// let user = {
// 	name: "Hello",
// 	email: "usser@gmail.com",
// 	gradyear: 2002,
// 	college: "MIT",
// 	major: "lit",
// 	country: "ind",
// 	city: "bng",
// 	mentor: true,
// };
