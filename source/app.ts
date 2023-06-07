import express, {NextFunction, Request, Response} from "express";
import * as path from "path";
import * as fs from "fs";
// import * as d from ".\\data_helpers\\mysql.js";

// let x: void = d.addUser("s");

require("dotenv").config();

const cookieParser = require("cookie-parser");

const app = express();
const PORT: number = parseInt(process.env.PORT?.toString() || "3000");
const SECRET_KEY: string = process.env.SECRET_KEY?.toString() || " ";
const web_url: string = process.env.URL?.toString() || "localhost";

app.set("view engine", "ejs"); // set the view engine to EJS
app.set("views", __dirname + "\\view"); // set the directory for the view templates

app.use((req, res, next) => {
	console.log(req.url);
	next();
});
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
const google_login = require("./routes/google_login.js");
app.use("/google_login", google_login);

const Callback = require("./routes/callback.js");
app.use("/callback", Callback);

import {parseJwt, verify_google_JWT} from "./helper/jwt_funcs.js";
import {States} from "./helper/states.js";
import {verify} from "jsonwebtoken";

function verify_request(req: Request, res: Response, next: NextFunction) {
	if (req.cookies.my_JWT) {
		//verify the signature of our JWT
		try {
			verify(req.cookies.my_JWT, SECRET_KEY, {});

			let my_jwt_tkn = parseJwt(req.cookies.my_JWT);

			console.log(my_jwt_tkn);

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
			console.log(data);
			//valid jwt token
			if (data) {
				let state = States.add();

				let get_my_jwt_url: string = `get_my_jwt/${state}?redirect_url=`;

				get_my_jwt_url = get_my_jwt_url + encodeURIComponent(req.url);

				//todo, change role to something corrent
				get_my_jwt_url = `${get_my_jwt_url}&role=jojo`;
				console.log(get_my_jwt_url);
				res.redirect(get_my_jwt_url);
			} else {
				res.send("FA ILED");
			}
			//invalid jwt token
		});
		return;
	}
	//user not authenticated
	res.redirect("login");
}

const get_my_jwt = require("./routes/get_my_jwt.js");
app.use("/get_my_jwt", get_my_jwt);

//with auth requirments
const Home = require("./routes/home.js");
app.use("//", verify_request, Home);

const login = require("./routes/login.js");
app.use("/login", login);

app.listen(PORT, web_url, () => {
	console.log("Server is listening on " + web_url + " on " + PORT);
	console.log(`URL: ${web_url + ":" + PORT}`);
});

app.use((req: Request, res: Response) => {
	res.send("FAIL");
});
