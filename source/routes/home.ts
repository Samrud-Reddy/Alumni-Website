import express, {Request, Response, NextFunction, Router} from "express";
const router = express.Router();

const client_id =
	"1009226817611-1hdu6omi5mua56h3fjcuvsgkuc5kagn4.apps.googleusercontent.com";
const client_secret = "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";

function parseJwt(token: string) {
	if (token) {
		return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
	}
	return "";
}

function verify_google_JWT(token: string) {
	let x = get_token_from_ggl(token).then((data) => {
		let jst_data = parseJwt(token);
		if (data["at_hash"] !== jst_data["at_hash"]) {
			return false;
		}
		let issuer = "https://accounts.google.com";
		if (data["iss"] !== issuer || jst_data["iss"] !== issuer) {
			return false;
		}

		if (data["aud"] !== client_id || jst_data["aud"] !== client_id) {
			return false;
		}

		let time = Math.floor(Date.now() / 1000);
		if (time > data["exp"] || time > jst_data["exp"]) {
			return false;
		}

		return true;
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

router.get("/", (req: Request, res: Response) => {
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

module.exports = router;
