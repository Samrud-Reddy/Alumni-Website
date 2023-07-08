"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
var jwt_funcs_1 = require("../helper/jwt_funcs");
router.get("/", function (req, res) {
    var myJWTtkn = req.cookies.my_JWT;
    var send = { role: (0, jwt_funcs_1.parseJwt)(myJWTtkn).role };
    res.render("index", send);
});
module.exports = router;
