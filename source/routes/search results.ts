import express, {Request, Response, NextFunction, Router} from "express";
const router = express.Router();

router.get("/", (req: Request, res: Response) => {
	res.send("results");
});

router.get("/filter", (req: Request, res: Response) => {
	let searchParams = req.query;
	console.log(searchParams);
	res.send("filter");
});

router.get("/search", (req: Request, res: Response) => {
	res.send("search");
});

module.exports = router;
