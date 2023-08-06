import express, {NextFunction, Request, Response} from "express";
import * as path from "path";
import * as fs from "fs";

require("dotenv").config();

const cookieParser = require("cookie-parser");

const app = express();
const PORT: number = parseInt(process.env.PORT?.toString() || "3000");
const SECRET_KEY: string = process.env.SECRET_KEY?.toString() || " ";
const web_url: string = process.env.URL?.toString() || "localhost";

app.set("view engine", "ejs"); // set the view engine to EJS
app.set("views", __dirname + "\\view"); // set the directory for the view templates

// !debug mode
// app.use((req, res, next) => {
// 	console.log(req.url);
// 	next();
// });

app.use(
	express.urlencoded({
		extended: true,
	})
);
app.use(express.json());
app.use(cookieParser());

app.use("/favicon.ico", (req: Request, res: Response, next: NextFunction) => {
	res.sendFile(__dirname + "/static/files/inv logo.ico");
});

app.use("*/styles", express.static(path.join(__dirname, "static/styles")));
app.use("*/files", express.static(path.join(__dirname, "static/files")));
app.use("*/scripts", express.static(path.join(__dirname, "scripts")));
app.use(express.static(path.join(__dirname, "scripts")));

//apps without verification requirments
const google_login = require("./routes/login/google_login.js");
app.use("/google_login", google_login);

const Callback = require("./routes/login/callback.js");
app.use("/callback", Callback);

import {parseJwt, verify_google_JWT} from "./helper/jwt_funcs.js";
import {States} from "./helper/states.js";
import {verify} from "jsonwebtoken";

function verify_request(req: Request, res: Response, next: NextFunction) {
	if (req.cookies.my_JWT) {
		//verify the signature of our JWT
		try {
			verify(req.cookies.my_JWT, SECRET_KEY, {});

			//tests if the JWT token is valid
			parseJwt(req.cookies.my_JWT);

			next();
			return;
		} catch (err) {
			console.log(err);
			res.cookie(
				"my_JWT",
				"Random string, does not maatter since cookie will be deleted",
				{maxAge: -3000}
			);
			res.redirect("/login");
			return;
		}
	}
	if (req.cookies.JWT_from_ggl) {
		//create a new JWT made by us, using googles JWT
		verify_google_JWT(req.cookies.JWT_from_ggl).then((data) => {
			//valid jwt token
			if (data) {
				let state = States.addState("my_jwt_token");

				let get_my_jwt_url: string = `get_my_jwt/${encodeURIComponent(
					state
				)}?redirect_url=`;

				get_my_jwt_url = get_my_jwt_url + encodeURIComponent(req.url);

				res.redirect(get_my_jwt_url);
			} else {
				res.send("FA ILED");
			}
			//invalid jwt token
		});
		return;
	}
	//user not authenticated
	res.redirect("/login");
}

const get_my_jwt = require("./routes/login/get_my_jwt.js");
app.use("/get_my_jwt", get_my_jwt);

const login = require("./routes/login/login.js");
app.use("/login", login);

app.get("/logout", (req: Request, res: Response) => {
	res.cookie(
		"my_JWT",
		"Random string, does not maatter since cookie will be deleted",
		{maxAge: -3000}
	);
	res.cookie(
		"JWT_from_ggl",
		"Random string, does not maatter since cookie will be deleted",
		{maxAge: -3000}
	);
	res.redirect("/login");
});

//verified request
const Home = require("./routes/home.js");
app.use("//", verify_request, Home);

const search_results = require("./routes/search results.js");
app.use("/results", verify_request, search_results);

app.listen(PORT, web_url, () => {
	console.log("Server is listening on " + web_url + " on " + PORT);
	console.log(`URL: http://${web_url + ":" + PORT}`);
});

app.use((req: Request, res: Response) => {
	res.send("FAIL");
});
