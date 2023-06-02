import express, {NextFunction, Request, Response} from "express";
import * as path from "path";
import * as fs from "fs";

require("dotenv").config();

const cookieParser = require("cookie-parser");

const app = express();
const PORT: number = parseInt(process.env.PORT?.toString() || "3000");
const SECRET_KEY: string = process.env.SECRET_KEY?.toString() || " ";
const URL: string = process.env.URL?.toString() || "localhost";

app.set("view engine", "ejs"); // set the view engine to EJS
app.set("views", __dirname + "\\view"); // set the directory for the view templates

app.use((req, res, next) => {
	console.log(req.url);
	next();
});
app.use(express.json());
app.use(cookieParser());

app.use("/favicon.ico", (req: Request, res: Response, next: NextFunction) => {
	res.sendFile(__dirname + "/static/files/inv logo.ico");
});

app.use("/styles", express.static(path.join(__dirname, "static/styles")));
app.use("/files", express.static(path.join(__dirname, "static/files")));
app.use("/scripts", express.static(path.join(__dirname, "scripts")));
app.use(express.static(path.join(__dirname, "scripts")));

//apps without verification requirments
const Login = require("./routes/login.js");
app.use("/login", Login);

const Callback = require("./routes/callback.js");
app.use("/callback", Callback);

import {verify_google_JWT} from "./helper/jwt_funcs.js";
import {States} from "./helper/states.js";
import {verify} from "jsonwebtoken";

function verify_request(req: Request, res: Response, next: NextFunction) {
	if (req.cookies.my_JWT) {
		//verify the signature of our JWT
		try {
			verify(req.cookies.my_JWT, SECRET_KEY, {});
			console.log("s");
			next();
			return;
		} catch (err) {
			console.log(err);
			res.cookie("my_JWT", "sdo", {maxAge: -3000});
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
				res.redirect("signup/" + state + "?redirect=" + req.url);
			} else {
				res.send("FA ILED");
			}
			//invalid jwt token
		});
		return;
	}
	//user not authenticated
	res.redirect("ssss");
}

const Signup = require("./routes/signup.js");
app.use("/signup", Signup);

//with auth requirments
const Home = require("./routes/home.js");
app.use("//", verify_request, Home);

app.get("/ssss", (req, res) => {
	res.render("login");
});

app.listen(PORT, URL, () => {
	console.log("Server is listening on " + URL + " on " + PORT);
	console.log(`URL: ${URL + ":" + PORT}`);
});

app.use((req: Request, res: Response) => {
	res.send("FAIL");
});
