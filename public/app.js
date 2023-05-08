"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const path = __importStar(require("path"));
const crypto_1 = require("crypto");
const { OAuth2Client } = require("google-auth-library");
const cookieParser = require("cookie-parser");
const app = (0, express_1.default)();
const PORT = 3000;
const url = `http://localhost:${PORT}`;
//secerets
const client_id = "1009226817611-1hdu6omi5mua56h3fjcuvsgkuc5kagn4.apps.googleusercontent.com";
const client_secret = "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";
const client = new OAuth2Client(client_id);
//states
var states = new Set();
app.set("view engine", "ejs"); // set the view engine to EJS
app.set("views", __dirname + "\\view"); // set the directory for the view templates
app.use(express_1.default.json());
app.use(cookieParser());
app.use("/styles", express_1.default.static(path.join(__dirname, "static/styles")));
app.use("/files", express_1.default.static(path.join(__dirname, "static/files")));
app.use("/scripts", express_1.default.static(path.join(__dirname, "scripts")));
app.use(express_1.default.static(path.join(__dirname, "scripts")));
function parseJwt(token) {
    if (token) {
        return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
    }
    return "";
}
function verify_google_JWT(token) {
    let x = get_token_from_ggl(token).then((data) => {
        let jst_data = parseJwt(token);
        if (data["at_hash"] === jst_data["at_hash"]) {
            let issuer = "https://accounts.google.com";
            if (data["iss"] === issuer && jst_data["iss"] === issuer) {
                if (data["aud"] === client_id && jst_data["aud"] === client_id) {
                    let time = Math.floor(Date.now() / 1000);
                    if (time < data["exp"] && time < jst_data["exp"]) {
                        return true;
                    }
                }
            }
        }
        console.log("ERROR IN JWT token");
        console.log(jst_data["at_hash"]);
        console.log(data["at_hash"]);
        console.log(jst_data["at_hash"] === data["at_hash"]);
        console.log(jst_data);
        console.log(data);
        return false;
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
app.get("/", (req, res) => {
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
app.get("/login", (req, res) => {
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
app.get("/callback", (req, res, next) => {
    if (states.has(req.query.state)) {
        states.delete(req.query.state);
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
            res.cookie("JWT", data.id_token);
            res.redirect(url);
        })
            .catch((error) => console.error(error));
    }
    else {
        next();
    }
});
app.get("/code", (req, res) => {
    res.send("Hello");
});
app.listen(3000, () => {
    console.log("Server is listening on port" + PORT);
    console.log(`URL: ${url}`);
});
app.use((req, res) => {
    res.send("FAIL");
});
