import express, {NextFunction, Request, Response} from "express";
import * as path from "path";
import * as jwt from "jsonwebtoken";
import {getRandomValues, createHash} from "crypto";

const cookieParser = require("cookie-parser");

const app = express();
const PORT = 3000;
const url = `http://localhost:${PORT}`;

//secerets
const client_id =
	"1009226817611-1hdu6omi5mua56h3fjcuvsgkuc5kagn4.apps.googleusercontent.com";
const client_secret = "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";

//states
var states = new Set();

app.set("view engine", "ejs"); // set the view engine to EJS
app.set("views", __dirname + "\\view"); // set the directory for the view templates

app.use(express.json());
app.use(cookieParser());

app.use("/styles", express.static(path.join(__dirname, "static/styles")));
app.use("/files", express.static(path.join(__dirname, "static/files")));
app.use("/scripts", express.static(path.join(__dirname, "scripts")));
app.use(express.static(path.join(__dirname, "scripts")));

app.get("/", (req: Request, res: Response) => {
	const data = {title: "My EJS App", message: "Hello, World!"};
	res.render("index", data); // render the 'index.ejs' template with the data
});

app.get("/login", (req: Request, res: Response) => {
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

app.get("/callback", (req: Request, res: Response, next: NextFunction) => {
	console.log(req.query);

	if (states.has(req.query.state)) {
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
		})
			.then((response) => response.json())
			.then((data) => console.log(data))
			.catch((error) => console.error(error));

		res.redirect(url);
	}

	next();
});

app.get("/code", (req: Request, res: Response) => {
	res.send("Hello");
});

app.listen(3000, () => {
	console.log("Server is listening on port" + PORT);
	console.log(`URL: ${url}`);
});

app.use((req: Request, res: Response) => {
	res.send("FAIL");
});
