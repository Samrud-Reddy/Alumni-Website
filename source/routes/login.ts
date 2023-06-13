import express, {Request, Response, NextFunction, Router} from "express";
const router = express.Router();

router.get("/", (req, res) => {
	res.render("login/welcome");
});

router.get("/alumini", (req, res) => {
	res.render("login/alumini");
});

router.get("/std-teach/:user", (req: Request, res) => {
	res.render("login/login_for_std_teach", {user: req.params.user});
});

router.get("/signup", (req: Request, res) => {
	res.render("login/signup");
});

import {verifyAndAddUser, user_interface} from "../data_helpers/mysql";

// export interface user_interface {
// 	name: string;
// 	email: string;
// 	gradyear: number;
// 	college: string;
// 	major: string;
// 	job?: string;
// 	country: string;
// 	city: string;
// 	mentor: boolean;
// }

router.post("/signup", (req: Request, res) => {
	let userInfo = req.body;

	let correctedUser: user_interface = userInfo;

	res.redirect("/login");
});
module.exports = router;
