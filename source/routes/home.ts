import express, {Request, Response, NextFunction, Router} from "express";
const router = express.Router();
import {parseJwt} from "../helper/jwt_funcs";

router.get("/", (req: Request, res: Response) => {
	let myJWTtkn = req.cookies.my_JWT;

	const send = {role: parseJwt(myJWTtkn).role, title: "Logged in"};

	res.render("index", send);
});

module.exports = router;
