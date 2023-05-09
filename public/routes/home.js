"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const client_id = "1009226817611-1hdu6omi5mua56h3fjcuvsgkuc5kagn4.apps.googleusercontent.com";
const client_secret = "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";
function parseJwt(token) {
    if (token) {
        return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
    }
    return "";
}
function verify_google_JWT(token) {
    let x = get_token_from_ggl(token).then((data) => {
        let jst_data = parseJwt(token);
        if (data["at_hash"] !== jst_data["at_hash"]) {
            return false;
        }
        let issuer = "https://accounts.google.com";
        if (data["iss"] !== issuer || jst_data["iss"] !== issuer) {
            return false;
        }
        if (data["aud"] !== client_id || jst_data["aud"] !== client_id) {
            return false;
        }
        let time = Math.floor(Date.now() / 1000);
        if (time > data["exp"] || time > jst_data["exp"]) {
            return false;
        }
        return true;
    });
    return x;
}
function get_token_from_ggl(token) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch("https://oauth2.googleapis.com/tokeninfo?id_token=" + token);
        const jsonData = yield response.json();
        return jsonData;
    });
}
router.get("/", (req, res) => {
    const send = { title: "My EJS App", message: "Hello, World!" };
    const JWT_of_user = req.cookies.JWT;
    verify_google_JWT(JWT_of_user).then((data) => {
        if (data) {
            res.render("index", send);
        }
        else {
            res.redirect("login"); // render the 'index.ejs' template with the data
        }
    });
});
module.exports = router;
