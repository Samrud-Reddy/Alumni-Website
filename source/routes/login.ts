import express, {Request, Response, NextFunction, Router} from "express";
import {getRandomValues, createHash} from "crypto";

let states = require("../helper/states.js");

const router = express.Router();

const PORT: string = process.env.PORT?.toString() || "3000";

const url = `http://localhost:${PORT}`;

const client_id: string = process.env.CLIENT_ID?.toString() || "";
const client_secret: string = process.env.CLIENT_SECRET?.toString() || "";

router.get("/", (req: Request, res: Response) => {
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

	let state = make_random_num();
	let callback = url + "/callback";

	let auth_url = "https://accounts.google.com/o/oauth2/v2/auth?";
	let search_querys = new URLSearchParams({
		response_type: "code",
		client_id: client_id,
		redirect_uri: callback,
		scope: "openid email profile",
		state: state,
		nonce: make_random_num(),
	});

	auth_url = auth_url + search_querys.toString();

	states.add(state);

	res.redirect(auth_url);
});

module.exports = router;
