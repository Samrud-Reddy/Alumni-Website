"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const client_id = ((_a = process.env.CLIENT_ID) === null || _a === void 0 ? void 0 : _a.toString()) || "";
const client_secret = ((_b = process.env.CLIENT_SECRET) === null || _b === void 0 ? void 0 : _b.toString()) || "";
const jwt_helper = require("../helper/jwt_funcs");
const jwt = 6;
router.get("/", (req, res) => {
    const send = { title: "My EJS App", message: "Hello, World!" };
    const JWT_of_user = req.cookies.JWT;
    jwt_helper.verify_google_JWT(JWT_of_user).then((data) => {
        if (data) {
            res.render("index", send);
        }
        else {
            res.redirect("login"); // render the 'index.ejs' template with the data
        }
    });
});
module.exports = router;
