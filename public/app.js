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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var path = __importStar(require("path"));
// import * as d from ".\\data_helpers\\mysql.js";
// let x: void = d.addUser("s");
require("dotenv").config();
var cookieParser = require("cookie-parser");
var app = (0, express_1.default)();
var PORT = parseInt(((_a = process.env.PORT) === null || _a === void 0 ? void 0 : _a.toString()) || "3000");
var SECRET_KEY = ((_b = process.env.SECRET_KEY) === null || _b === void 0 ? void 0 : _b.toString()) || " ";
var web_url = ((_c = process.env.URL) === null || _c === void 0 ? void 0 : _c.toString()) || "localhost";
app.set("view engine", "ejs"); // set the view engine to EJS
app.set("views", __dirname + "\\view"); // set the directory for the view templates
app.use(function (req, res, next) {
    console.log(req.url);
    next();
});
app.use(express_1.default.json());
app.use(cookieParser());
app.use("/favicon.ico", function (req, res, next) {
    res.sendFile(__dirname + "/static/files/inv logo.ico");
});
app.use("/styles", express_1.default.static(path.join(__dirname, "static/styles")));
app.use("/files", express_1.default.static(path.join(__dirname, "static/files")));
app.use("/scripts", express_1.default.static(path.join(__dirname, "scripts")));
app.use(express_1.default.static(path.join(__dirname, "scripts")));
//apps without verification requirments
var google_login = require("./routes/google_login.js");
app.use("/google_login", google_login);
var Callback = require("./routes/callback.js");
app.use("/callback", Callback);
var jwt_funcs_js_1 = require("./helper/jwt_funcs.js");
var states_js_1 = require("./helper/states.js");
var jsonwebtoken_1 = require("jsonwebtoken");
function verify_request(req, res, next) {
    if (req.cookies.my_JWT) {
        //verify the signature of our JWT
        try {
            (0, jsonwebtoken_1.verify)(req.cookies.my_JWT, SECRET_KEY, {});
            var my_jwt_tkn = (0, jwt_funcs_js_1.parseJwt)(req.cookies.my_JWT);
            console.log(my_jwt_tkn);
            next();
            return;
        }
        catch (err) {
            console.log(err);
            res.cookie("my_JWT", "Random string, does not maatter since cookie will be deleted", { maxAge: -3000 });
            res.redirect("/login");
            return;
        }
    }
    if (req.cookies.JWT_from_ggl) {
        //create a new JWT made by us, using googles JWT
        (0, jwt_funcs_js_1.verify_google_JWT)(req.cookies.JWT_from_ggl).then(function (data) {
            console.log(data);
            //valid jwt token
            if (data) {
                var state = states_js_1.States.add();
                var get_my_jwt_url = new URL(state, web_url);
                get_my_jwt_url.searchParams.append("redirect_url", req.url);
                //todo, change role to something corrent
                get_my_jwt_url.searchParams.append("role", "jojo");
                console.log(get_my_jwt_url);
                res.redirect(get_my_jwt_url.toString());
            }
            else {
                res.send("FA ILED");
            }
            //invalid jwt token
        });
        return;
    }
    //user not authenticated
    res.redirect("login");
}
var get_my_jwt = require("./routes/get_my_jwt.js");
app.use("/get_my_jwt", get_my_jwt);
//with auth requirments
var Home = require("./routes/home.js");
app.use("//", verify_request, Home);
app.get("/login", function (req, res) {
    res.render("login");
});
app.listen(PORT, web_url, function () {
    console.log("Server is listening on " + web_url + " on " + PORT);
    console.log("URL: ".concat(web_url + ":" + PORT));
});
app.use(function (req, res) {
    res.send("FAIL");
});
