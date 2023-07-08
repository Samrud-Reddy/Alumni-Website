import express, {Request, Response, NextFunction, Router} from "express";

import {States} from "../../helper/states.js";

const router = express.Router();

const PORT: string = process.env.PORT?.toString() || "3000";

const url = `http://localhost:${PORT}`;

const client_id: string = process.env.CLIENT_ID?.toString() || "";
const client_secret: string = process.env.CLIENT_SECRET?.toString() || "";

router.get("/", (req: Request, res: Response) => {
	let state = States.addState("ggl_jwt_token");
	let callback = url + "/callback";

	let auth_url = "https://accounts.google.com/o/oauth2/v2/auth?";
	let search_querys = new URLSearchParams({
		response_type: "code",
		client_id: client_id,
		redirect_uri: callback,
		scope: "openid email profile",
		state: state,
		nonce: States.makeRandomNum(),
	});

	auth_url = auth_url + search_querys.toString();

	res.redirect(auth_url);
});

module.exports = router;
