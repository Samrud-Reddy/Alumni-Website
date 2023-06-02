"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
var states_js_1 = require("../helper/states.js");
var PORT = ((_a = process.env.PORT) === null || _a === void 0 ? void 0 : _a.toString()) || "3000";
var url = "http://localhost:".concat(PORT);
var client_id = ((_b = process.env.CLIENT_ID) === null || _b === void 0 ? void 0 : _b.toString()) || "";
var client_secret = ((_c = process.env.CLIENT_SECRET) === null || _c === void 0 ? void 0 : _c.toString()) || "";
router.get("/", function (req, res, next) {
    var _a;
    console.log(req.query);
    var state = ((_a = req.query.state) === null || _a === void 0 ? void 0 : _a.toString()) || "";
    if (states_js_1.States.has(state)) {
        states_js_1.States.remove(state);
        var x = fetch("https://oauth2.googleapis.com/token", {
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
        x.then(function (response) { return response.json(); })
            .then(function (data) {
            res.cookie("JWT_from_ggl", data.id_token, {
                maxAge: 10 * 60 * 1000,
                httpOnly: true,
            });
            res.redirect(url);
        })
            .catch(function (error) { return console.error(error); });
    }
    else {
        res.redirect("login");
    }
});
module.exports = router;
