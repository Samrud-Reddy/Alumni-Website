const client_id: string = process.env.CLIENT_ID?.toString() || "";
const client_secret: string = process.env.CLIENT_SECRET?.toString() || "";

export function parseJwt(token: string) {
	if (token) {
		return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
	}
	return "";
}

export async function get_token_from_ggl(token: string) {
	const response = await fetch(
		"https://oauth2.googleapis.com/tokeninfo?id_token=" + token
	);
	const jsonData = await response.json();
	return jsonData;
}

export function verify_google_JWT(token: string) {
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
