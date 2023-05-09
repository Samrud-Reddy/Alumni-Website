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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var path = __importStar(require("path"));
require("dotenv").config();
var OAuth2Client = require("google-auth-library").OAuth2Client;
var cookieParser = require("cookie-parser");
var app = (0, express_1.default)();
var PORT = ((_a = process.env.PORT) === null || _a === void 0 ? void 0 : _a.toString()) || "3000";
var url = "http://localhost:".concat(PORT);
app.set("view engine", "ejs"); // set the view engine to EJS
app.set("views", __dirname + "\\view"); // set the directory for the view templates
app.use(express_1.default.json());
app.use(cookieParser());
app.use("/styles", express_1.default.static(path.join(__dirname, "static/styles")));
app.use("/files", express_1.default.static(path.join(__dirname, "static/files")));
app.use("/scripts", express_1.default.static(path.join(__dirname, "scripts")));
app.use(express_1.default.static(path.join(__dirname, "scripts")));
//apps without verification requirments
var Login = require("./routes/login.js");
app.use("/login", Login);
var Callback = require("./routes/callback.js");
app.use("/callback", Callback);
function verify_request(req, res, next) {
    if (req.cookies.my_JWT) {
        //verify the signature of our JWT
        next();
    }
    if (req.cookies.JWT) {
        //create a new JWT made by us, using googles JWT
        next();
    }
    res.redirect("login");
}
//with auth requirments
var Home = require("./routes/home.js");
app.use("/", Home);
app.listen(3000, function () {
    console.log("Server is listening on port:- " + PORT);
    console.log("URL: ".concat(url));
});
app.use(function (req, res) {
    res.send("FAIL");
});
