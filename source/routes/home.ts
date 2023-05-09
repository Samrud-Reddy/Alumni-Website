import express, {Request, Response, NextFunction, Router} from "express";
const router = express.Router();

const client_id: string = process.env.CLIENT_ID?.toString() || "";
const client_secret: string = process.env.CLIENT_SECRET?.toString() || "";

const jwt_helper = require("../helper/jwt_funcs");

const jwt = 6;
router.get("/", (req: Request, res: Response) => {
	const send = {title: "My EJS App", message: "Hello, World!"};
	const JWT_of_user = req.cookies.JWT;
	jwt_helper.verify_google_JWT(JWT_of_user).then((data: boolean) => {
		if (data) {
			res.render("index", send);
		} else {
			res.redirect("login"); // render the 'index.ejs' template with the data
		}
	});
});

module.exports = router;
