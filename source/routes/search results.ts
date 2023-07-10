import express, {Request, Response, NextFunction, Router} from "express";
import {findAlumni, getAllForCache} from "../data_helpers/mysql";
const router = express.Router();

class WordListCache {
	words: any[];

	constructor() {
		this.words = [];
	}

	update() {
		getAllForCache().then((results: any) => {
			results = JSON.parse(JSON.stringify(results));

			for (let i in results) {
				for (let j in results[i]) {
					let label = j;
					if (results[i][j] != "") {
						this.words.push([label, results[i][j]]);
					}
				}
			}
		});
	}
}

export let wordCachList = new WordListCache();

router.get("/filter", (req: Request, res: Response) => {
	let searchParams = req.query;
	let results = findAlumni(searchParams);

	results.then((result) => {
		res.send(result);
	});
	for (let i in wordCachList.words) {
		console.log(wordCachList.words[i]);
	}
});

router.get("/search", (req: Request, res: Response) => {
	let search = req.query.query;

	wordCachList.update();
});

import {distance} from "../helper/distance_between_words";
let x = ["localy", "locely", "loccally", "locali"];

for (let i in x) {
	console.log(distance(x[i], "locally"));
}
module.exports = router;
