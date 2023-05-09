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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.verify_google_JWT = exports.get_token_from_ggl = exports.parseJwt = void 0;
const client_id = ((_a = process.env.CLIENT_ID) === null || _a === void 0 ? void 0 : _a.toString()) || "";
const client_secret = ((_b = process.env.CLIENT_SECRET) === null || _b === void 0 ? void 0 : _b.toString()) || "";
function parseJwt(token) {
    if (token) {
        return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
    }
    return "";
}
exports.parseJwt = parseJwt;
function get_token_from_ggl(token) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch("https://oauth2.googleapis.com/tokeninfo?id_token=" + token);
        const jsonData = yield response.json();
        return jsonData;
    });
}
exports.get_token_from_ggl = get_token_from_ggl;
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
exports.verify_google_JWT = verify_google_JWT;
