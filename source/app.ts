import express, {NextFunction, Request, Response} from "express";
import * as path from "path";
require("dotenv").config();

const {OAuth2Client} = require("google-auth-library");
const cookieParser = require("cookie-parser");

const app = express();
const PORT: string = process.env.PORT?.toString() || "3000";

const url = `http://localhost:${PORT}`;

app.set("view engine", "ejs"); // set the view engine to EJS
app.set("views", __dirname + "\\view"); // set the directory for the view templates

app.use(express.json());
app.use(cookieParser());

app.use("/styles", express.static(path.join(__dirname, "static/styles")));
app.use("/files", express.static(path.join(__dirname, "static/files")));
app.use("/scripts", express.static(path.join(__dirname, "scripts")));
app.use(express.static(path.join(__dirname, "scripts")));

//apps without verification requirments
const Login = require("./routes/login.js");
app.use("/login", Login);

const Callback = require("./routes/callback.js");
app.use("/callback", Callback);

//with auth requirments
const Home = require("./routes/home.js");
app.use("/", Home);

app.listen(3000, () => {
	console.log("Server is listening on port" + PORT);
	console.log(`URL: ${url}`);
});

app.use((req: Request, res: Response) => {
	res.send("FAIL");
});
