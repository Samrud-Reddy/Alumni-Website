import express, {Request, Response, NextFunction, Router} from "express";
const router = express.Router();

router.get("/", (req, res) => {
	res.render("login/welcome");
});

router.get("/alumini", (req, res) => {
	res.render("login/alumini");
});

router.get("/std-teach/:user", (req: Request, res, next) => {
	if (req.params.user === "student") {
		res.render("login/login_for_std_teach", {user: "student"});
	} else if (req.params.user === "faculty member") {
		res.render("login/login_for_std_teach", {user: "faculty member"});
	}
	next();
});

router.get("/signup", (req: Request, res) => {
	res.render("login/signup");
});

import {verifyAndAddUser, user_interface} from "../../data_helpers/mysql";

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

	if (userInfo.mentor) {
		userInfo.mentor = true;
	} else {
		userInfo.mentor = false;
	}
	var correctedUser: user_interface = userInfo;

	verifyAndAddUser(correctedUser).then((result) => {
		if (result === "USER_EXISTS") {
			res.render("login/signup", {user: correctedUser, alert: "user_exists"});
		} else if (result === "redirect") {
			res.redirect("/google_login");
		}
	});
});
module.exports = router;
