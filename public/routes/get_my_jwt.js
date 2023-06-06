"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var states_1 = require("../helper/states");
var jsonwebtoken_1 = require("jsonwebtoken");
var jwt_funcs_1 = require("../helper/jwt_funcs");
var SECRET_KEY = process.env.SECRET_KEY || "";
var router = express_1.default.Router();
router.get("/", function (req, res, next) {
    next();
});
function isFromInventure(hd) {
    if (hd && hd === "inventureacademy.com") {
        return true;
    }
    return false;
}
router.get("/:id", function (req, res, next) {
    if (states_1.States.has(req.params.id)) {
        states_1.States.remove(req.params.id);
        var role = req.params.role || "student";
        var ggl_jwt_payload = (0, jwt_funcs_1.parseJwt)(req.cookies.JWT_from_ggl);
        console.log(ggl_jwt_payload["hd"]);
        var my_JWT = (0, jsonwebtoken_1.sign)({
            email: ggl_jwt_payload.email,
            given_name: ggl_jwt_payload.given_name,
            family_name: ggl_jwt_payload.family_name,
            isInventureEmail: isFromInventure(ggl_jwt_payload.hd),
            role: role,
        }, SECRET_KEY, { algorithm: "HS256", expiresIn: "31d" });
        res.cookie("my_JWT", my_JWT, {
            maxAge: 10 * 60 * 1000,
            httpOnly: true,
        });
    }
    res.redirect(req.params.redirect_url || "/");
});
module.exports = router;
