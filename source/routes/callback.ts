import express, {Request, Response, NextFunction, Router} from "express";
const router = express.Router();

import {States} from "../helper/states.js";

const PORT: string = process.env.PORT?.toString() || "3000";

const url = `http://localhost:${PORT}`;

const client_id: string = process.env.CLIENT_ID?.toString() || "";
const client_secret: string = process.env.CLIENT_SECRET?.toString() || "";

router.get("/", (req: Request, res: Response, next: NextFunction) => {
	let state: string = req.query.state?.toString() || "";
	if (States.has(state)) {
		States.remove(state);
		let x = fetch("https://oauth2.googleapis.com/token", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: new URLSearchParams({
				code: (req.query.code || "Error").toString(),
				client_id: client_id,
				client_secret: client_secret,
				redirect_uri: url + "/callback",
				grant_type: "authorization_code",
			}),
		});

		x.then((response) => response.json())
			.then((data) => {
				res.cookie("JWT_from_ggl", data.id_token, {
					maxAge: 10 * 60 * 1000,
					httpOnly: true,
				});
				res.redirect(url);
			})
			.catch((error) => console.error(error));
	} else {
		res.redirect("login");
	}
});

module.exports = router;
