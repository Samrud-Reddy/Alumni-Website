import express, {Request, Response, NextFunction, Router} from "express";
const router = express.Router();
import {parseJwt} from "../helper/jwt_funcs";

router.get("/", (req: Request, res: Response) => {
	let valuesEmpty: boolean = req.query.valuesEmpty === "true";
	let myJWTtkn = req.cookies.my_JWT;

	const send = {role: parseJwt(myJWTtkn).role, showAlert: valuesEmpty};

	res.render("index", send);
});

module.exports = router;
