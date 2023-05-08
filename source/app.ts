import express, {NextFunction, Request, Response} from "express";
import * as path from "path";
import * as jwt from "jsonwebtoken";
import {getRandomValues, createHash} from "crypto";

const {OAuth2Client} = require("google-auth-library");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = 3000;
const url = `http://localhost:${PORT}`;

//secerets
const client_id =
	"1009226817611-1hdu6omi5mua56h3fjcuvsgkuc5kagn4.apps.googleusercontent.com";
const client_secret = "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";
const client = new OAuth2Client(client_id);

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

function parseJwt(token: string) {
	if (token) {
		return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
	}
	return "";
}

function verify_google_JWT(token: string) {
	let x = get_token_from_ggl(token).then((data) => {
		let jst_data = parseJwt(token);
		if (data["at_hash"] === jst_data["at_hash"]) {
			let issuer = "https://accounts.google.com";
			if (data["iss"] === issuer && jst_data["iss"] === issuer) {
				if (data["aud"] === client_id && jst_data["aud"] === client_id) {
					let time = Math.floor(Date.now() / 1000);
					if (time < data["exp"] && time < jst_data["exp"]) {
						return true;
					}
				}
			}
		}
		console.log("ERROR IN JWT token");
		console.log(jst_data["at_hash"]);
		console.log(data["at_hash"]);
		console.log(jst_data["at_hash"] === data["at_hash"]);
		console.log(jst_data);
		console.log(data);
		return false;
	});
	return x;
}

async function get_token_from_ggl(token: string) {
	const response = await fetch(
		"https://oauth2.googleapis.com/tokeninfo?id_token=" + token
	);
	const jsonData = await response.json();
	return jsonData;
}

app.get("/", (req: Request, res: Response) => {
	const send = {title: "My EJS App", message: "Hello, World!"};
	const JWT_of_user = req.cookies.JWT;
	verify_google_JWT(JWT_of_user).then((data) => {
		if (data) {
			res.render("index", send);
		} else {
			res.redirect("login"); // render the 'index.ejs' template with the data
		}
	});
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
	if (states.has(req.query.state)) {
		states.delete(req.query.state);
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
				res.cookie("JWT", data.id_token);
				res.redirect(url);
			})
			.catch((error) => console.error(error));
	} else {
		next();
	}
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
