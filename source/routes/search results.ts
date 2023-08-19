import express, {Request, Response, NextFunction, Router} from "express";
import {findAlumni, getAllForCache} from "../data_helpers/mysql";
import {distance} from "../helper/distance_between_words";

const router = express.Router();

interface nameOBJ {
	label: string;
	query: string;
	SplitWords: string[];
}

class WordListCache {
	words: nameOBJ[];
	lastOrd: number;

	constructor() {
		this.words = [];
		this.lastOrd = 0;
	}

	private fixWord(word: string): string {
		word = word.toLowerCase();
		let pattern: RegExp = /[a-z0-9]/g;
		let textMatches: Array<string> = word.match(pattern) || [];

		let joined = textMatches.join("");

		return joined;
	}

	update() {
		getAllForCache(this.lastOrd).then((results: any) => {
			results = JSON.parse(JSON.stringify(results));
			let greatestOrd = this.lastOrd;
			//Sorry future devlopers for this code, was in a time crunch
			for (let i in results) {
				for (let j in results[i]) {
					let label = j;

					if (results[i][j] != "") {
						if (label === "id") {
							if (greatestOrd < results[i][j]) {
								greatestOrd = results[i][j];
							}
						} else {
							let splitWrds = results[i][j].split(" ");
							let nameObj: nameOBJ = {
								label: label,
								query: results[i][j],
								SplitWords: [],
							};
							for (let k in splitWrds) {
								nameObj.SplitWords.push(this.fixWord(splitWrds[k]));
							}

							this.words.push(nameObj);
						}
					}
				}
			}

			this.lastOrd = greatestOrd;
		});
	}

	match(keywords: string[]) {
		let finalResponse: {catogery: string; query: string}[] = [];

		for (let currentword in keywords) {
			currentword = keywords[currentword];

			for (let i in this.words) {
				for (let keyword in this.words[i].SplitWords) {
					keyword = this.words[i].SplitWords[keyword];
					if (distance(keyword, currentword) <= 2) {
						finalResponse.push({
							catogery: this.words[i].label,
							query: this.words[i].query,
						});
					}
				}
			}
		}

		return finalResponse;
	}
}

let wordCachList = new WordListCache();
wordCachList.update();

router.get("/search", (req: Request, res: Response) => {
	wordCachList.update();
	let searchQuery: string | string[] = req.query.query?.toString() || "";
	searchQuery = searchQuery.split(" ");

	let catogeries = wordCachList.match(searchQuery);

	interface SearchParams {
		name?: string;
		gradyear?: number;
		college?: string;
		major?: string;
		job?: string;
		country?: string;
		city?: string;
	}

	let search_params: any[] = [];
	let currentParam: any = {};

	for (let i in catogeries) {
		currentParam[catogeries[i].catogery] = catogeries[i].query;
		search_params.push(findAlumni(currentParam));
		currentParam = {};
	}

	Promise.all(search_params).then((values) => {
		values = values.flat();
		values = values.filter((value, index, self) => {
			let id = value.id;
			let indexOfElement: any = 0;
			for (let i in self) {
				if (self[i].id === id) {
					indexOfElement = Number(i);
					break;
				}
			}
			return indexOfElement === index;
		});

		console.log(values);
		displayResults(req, res, values);
	});
});

function displayResults(req: Request, res: Response, values: any) {
	if (values.length === 0) {
		res.redirect("/?valuesEmpty=true");
	} else {
		res.render("result.ejs", {values: values});
	}
}

module.exports = router;
