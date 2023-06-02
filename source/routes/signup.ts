import express, {Request, Response, NextFunction, Router} from "express";
import {States} from "../helper/states";
import {sign} from "jsonwebtoken";
import {parseJwt} from "../helper/jwt_funcs";

const SECRET_KEY: string = process.env.SECRET_KEY || "";

const router = express.Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
	next();
});

router.get("/:id", (req: Request, res: Response, next: NextFunction) => {
	if (States.has(req.params.id)) {
		States.remove(req.params.id);

		let ggl_jwt_payload = parseJwt(req.cookies.JWT_from_ggl);

		let my_JWT = sign(
			{
				email: ggl_jwt_payload.email,
				given_name: ggl_jwt_payload.given_name,
				family_name: ggl_jwt_payload.family_name,
			},
			SECRET_KEY,
			{algorithm: "HS256", expiresIn: "31d"}
		);
		res.cookie("my_JWT", my_JWT, {
			maxAge: 10 * 60 * 1000,
			httpOnly: true,
		});
	}
	res.redirect("/");
});
module.exports = router;
