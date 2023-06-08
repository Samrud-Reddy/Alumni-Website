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

router.post("/signup", (req: Request, res) => {
	console.log(req.body);
	res.redirect("/login");
});
module.exports = router;
