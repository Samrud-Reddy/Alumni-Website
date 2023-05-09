import express, {Request, Response, NextFunction, Router} from "express";
const router = express.Router();

import {verify_google_JWT} from "../helper/jwt_funcs.js";

router.get("/", (req: Request, res: Response) => {
	const send = {title: "My EJS App", message: "Hello, World!"};
	const JWT_of_user = req.cookies.JWT_from_ggl;
	verify_google_JWT(JWT_of_user).then((data: boolean) => {
		if (data) {
			res.render("index", send);
		} else {
			res.redirect("login"); // render the 'index.ejs' template with the data
		}
	});
});

module.exports = router;
