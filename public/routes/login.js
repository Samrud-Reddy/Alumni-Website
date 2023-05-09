"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var crypto_1 = require("crypto");
var states_js_1 = require("../helper/states.js");
var router = express_1.default.Router();
var PORT = ((_a = process.env.PORT) === null || _a === void 0 ? void 0 : _a.toString()) || "3000";
var url = "http://localhost:".concat(PORT);
var client_id = ((_b = process.env.CLIENT_ID) === null || _b === void 0 ? void 0 : _b.toString()) || "";
var client_secret = ((_c = process.env.CLIENT_SECRET) === null || _c === void 0 ? void 0 : _c.toString()) || "";
router.get("/", function (req, res) {
    function make_random_num(x) {
        var state;
        var randomnumber = (0, crypto_1.getRandomValues)(new BigInt64Array(x || 16));
        state =
            (0, crypto_1.createHash)("sha256")
                .update(randomnumber.slice(0, randomnumber.length / 2).toString())
                .digest("base64url")
                .toString() +
                (0, crypto_1.createHash)("sha256")
                    .update(randomnumber
                    .slice(randomnumber.length / 2, randomnumber.length)
                    .toString())
                    .digest("base64url")
                    .toString();
        return state;
    }
    var state = make_random_num();
    var callback = url + "/callback";
    var auth_url = "https://accounts.google.com/o/oauth2/v2/auth?";
    var search_querys = new URLSearchParams({
        response_type: "code",
        client_id: client_id,
        redirect_uri: callback,
        scope: "openid email profile",
        state: state,
        nonce: make_random_num(),
    });
    auth_url = auth_url + search_querys.toString();
    (0, states_js_1.add)(state);
    res.redirect(auth_url);
});
module.exports = router;
