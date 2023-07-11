"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var mysql_1 = require("../data_helpers/mysql");
var distance_between_words_1 = require("../helper/distance_between_words");
var router = express_1.default.Router();
var WordListCache = /** @class */ (function () {
    function WordListCache() {
        this.words = [];
        this.lastOrd = 0;
    }
    WordListCache.prototype.fixWord = function (word) {
        word = word.toLowerCase();
        var pattern = /[a-z0-9]/g;
        var textMatches = word.match(pattern) || [];
        var joined = textMatches.join("");
        return joined;
    };
    WordListCache.prototype.update = function () {
        var _this = this;
        (0, mysql_1.getAllForCache)(this.lastOrd).then(function (results) {
            results = JSON.parse(JSON.stringify(results));
            var greatestOrd = _this.lastOrd;
            //Sorry future devlopers for this code, was in a time crunch
            for (var i in results) {
                for (var j in results[i]) {
                    var label = j;
                    if (results[i][j] != "") {
                        if (label === "id") {
                            if (greatestOrd < results[i][j]) {
                                greatestOrd = results[i][j];
                            }
                        }
                        else {
                            var splitWrds = results[i][j].split(" ");
                            var nameObj = {
                                label: label,
                                query: results[i][j],
                                SplitWords: [],
                            };
                            for (var k in splitWrds) {
                                nameObj.SplitWords.push(_this.fixWord(splitWrds[k]));
                            }
                            _this.words.push(nameObj);
                        }
                    }
                }
            }
            _this.lastOrd = greatestOrd;
        });
    };
    WordListCache.prototype.match = function (keywords) {
        var finalResponse = [];
        for (var currentword in keywords) {
            currentword = keywords[currentword];
            for (var i in this.words) {
                for (var keyword in this.words[i].SplitWords) {
                    keyword = this.words[i].SplitWords[keyword];
                    if ((0, distance_between_words_1.distance)(keyword, currentword) <= 3) {
                        finalResponse.push({
                            catogery: this.words[i].label,
                            query: this.words[i].query,
                        });
                    }
                }
            }
        }
        return finalResponse;
    };
    return WordListCache;
}());
var wordCachList = new WordListCache();
wordCachList.update();
router.get("/filter", function (req, res) {
    var searchParams = req.query;
    var results = (0, mysql_1.findAlumni)(searchParams);
    results.then(function (result) {
        res.send(result);
    });
});
router.get("/search", function (req, res) {
    var _a;
    var searchQuery = ((_a = req.query.query) === null || _a === void 0 ? void 0 : _a.toString()) || "";
    searchQuery = searchQuery.split(" ");
    wordCachList.update();
    var catogeries = wordCachList.match(searchQuery);
    var search_params = [];
    var currentParam = {};
    for (var i in catogeries) {
        currentParam[catogeries[i].catogery] = catogeries[i].query;
        search_params.push((0, mysql_1.findAlumni)(currentParam));
        currentParam = {};
    }
    Promise.all(search_params).then(function (values) {
        values = values.flat();
        values = values.filter(function (value, index, self) {
            var id = value.id;
            var indexOfElement = 0;
            for (var i in self) {
                if (self[i].id === id) {
                    indexOfElement = Number(i);
                    break;
                }
            }
            return indexOfElement === index;
        });
        res.send(values);
    });
});
module.exports = router;
