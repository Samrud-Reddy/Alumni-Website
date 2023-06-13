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

export async function verifyAndAddUser(
	user: user_interface
): Promise<string[]> {
	return knex("users")
		.select("*")
		.where({email: user.email})
		.then((rows: RowDataPacket[]) => {
			if (rows.length !== 0) {
				return ["USER_EXISTS"];
			}

			let resultOfSQL: any = knex("users").insert(user);
			if (typeof resultOfSQL === "object") {
				if (typeof resultOfSQL[0] === "number") {
					return ["redirect"];
				}
			}
			console.log(resultOfSQL, "\n", user);
			return ["failed"];
		});
}

let user = {
	name: "Hello",
	email: "usser@gmail.com",
	gradyear: 2002,
	college: "MIT",
	major: "lit",
	country: "ind",
	city: "bng",
	mentor: true,
};
