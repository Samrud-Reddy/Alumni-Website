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
var mysql_1 = require("../data_helpers/mysql");
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
router.post("/signup", function (req, res) {
    var userInfo = req.body;
    if (userInfo.mentor) {
        userInfo.mentor = true;
    }
    else {
        userInfo.mentor = false;
    }
    var correctedUser = userInfo;
    (0, mysql_1.verifyAndAddUser)(correctedUser).then(function (result) {
        console.log("\n", result, "\n");
        if (result === "USER_EXISTS") {
            res.render("login/signup", { user: correctedUser, alert: "user_exists" });
        }
        else if (result === "redirect") {
            res.redirect("/login");
        }
    });
});
module.exports = router;
