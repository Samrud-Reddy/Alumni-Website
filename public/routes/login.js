"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
router.get("/", function (req, res) {
    res.render("login/welcome");
});
router.get("/alumini", function (req, res) {
    res.render("login/alumini");
});
router.get("/std-teach/:user", function (req, res) {
    res.render("login/login_for_std_teach", { user: req.params.user });
});
router.get("/signup", function (req, res) {
    res.render("login/signup");
});
router.post("/signup", function (req, res) {
    console.log(req.body);
    res.redirect("/login");
});
module.exports = router;
