"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const crypto_1 = require("crypto");
let states = require("C:\\Users\\samru\\Desktop\\Code\\Alumini Website\\Code\\public\\helper\\states.js");
const router = express_1.default.Router();
const PORT = ((_a = process.env.PORT) === null || _a === void 0 ? void 0 : _a.toString()) || "3000";
const url = `http://localhost:${PORT}`;
const client_id = ((_b = process.env.CLIENT_ID) === null || _b === void 0 ? void 0 : _b.toString()) || "";
const client_secret = ((_c = process.env.CLIENT_SECRET) === null || _c === void 0 ? void 0 : _c.toString()) || "";
router.get("/", (req, res) => {
    function make_random_num(x) {
        let state;
        let randomnumber = (0, crypto_1.getRandomValues)(new BigInt64Array(x || 16));
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
    let state = make_random_num();
    let callback = url + "/callback";
    let auth_url = "https://accounts.google.com/o/oauth2/v2/auth?";
    let search_querys = new URLSearchParams({
        response_type: "code",
        client_id: client_id,
        redirect_uri: callback,
        scope: "openid email profile",
        state: state,
        nonce: make_random_num(),
    });
    auth_url = auth_url + search_querys.toString();
    states.add(state);
    res.redirect(auth_url);
});
module.exports = router;
