import express, {Request, Response, NextFunction, Router} from "express";
const router = express.Router();

router.get("/", (req: Request, res: Response) => {
	const send = {title: "My EJS App", message: "Hello, World!"};
	res.render("index", send);
});

module.exports = router;
