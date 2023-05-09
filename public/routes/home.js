"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
var jwt_funcs_js_1 = require("../helper/jwt_funcs.js");
var jwt = 6;
router.get("/", function (req, res) {
    var send = { title: "My EJS App", message: "Hello, World!" };
    var JWT_of_user = req.cookies.JWT;
    (0, jwt_funcs_js_1.verify_google_JWT)(JWT_of_user).then(function (data) {
        if (data) {
            res.render("index", send);
        }
        else {
            res.redirect("login"); // render the 'index.ejs' template with the data
        }
    });
});
module.exports = router;
