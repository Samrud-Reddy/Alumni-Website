"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
let states = require("../helper/states.js");
const PORT = ((_a = process.env.PORT) === null || _a === void 0 ? void 0 : _a.toString()) || "3000";
const url = `http://localhost:${PORT}`;
const client_id = ((_b = process.env.CLIENT_ID) === null || _b === void 0 ? void 0 : _b.toString()) || "";
const client_secret = ((_c = process.env.CLIENT_SECRET) === null || _c === void 0 ? void 0 : _c.toString()) || "";
router.get("/", (req, res, next) => {
    if (states.has(req.query.state)) {
        states.remove(req.query.state);
        let x = fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                code: (req.query.code || "Error").toString(),
                client_id: client_id,
                client_secret: client_secret,
                redirect_uri: url + "/callback",
                grant_type: "authorization_code",
            }),
        });
        x.then((response) => response.json())
            .then((data) => {
            res.cookie("JWT", data.id_token, {
                maxAge: 10 * 60 * 1000,
                httpOnly: true,
            });
            res.redirect(url);
        })
            .catch((error) => console.error(error));
    }
    else {
        res.redirect("login");
    }
});
module.exports = router;
