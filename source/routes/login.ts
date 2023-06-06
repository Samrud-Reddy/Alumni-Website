import express, {Request, Response, NextFunction, Router} from "express";
const router = express.Router();

router.get("/", (req, res) => {
	res.render("welcome");
});

router.get("/alumini", (req, res) => {
	res.render("alumini");
});

router.get("/std-teach", (req, res) => {
	res.render("login_for_std_teach");
});
module.exports = router;
