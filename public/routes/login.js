"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
router.get("/", function (req, res) {
    res.render("welcome");
});
router.get("/alumini", function (req, res) {
    res.render("alumini");
});
router.get("/std-teach", function (req, res) {
    res.render("login_for_std_teach");
});
module.exports = router;
