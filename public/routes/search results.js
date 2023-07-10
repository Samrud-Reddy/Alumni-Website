"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wordCachList = void 0;
var express_1 = __importDefault(require("express"));
var mysql_1 = require("../data_helpers/mysql");
var router = express_1.default.Router();
var WordListCache = /** @class */ (function () {
    function WordListCache() {
        this.words = [];
    }
    WordListCache.prototype.update = function () {
        var _this = this;
        (0, mysql_1.getAllForCache)().then(function (results) {
            results = JSON.parse(JSON.stringify(results));
            for (var i in results) {
                for (var j in results[i]) {
                    var label = j;
                    if (results[i][j] != "") {
                        _this.words.push([label, results[i][j]]);
                    }
                }
            }
        });
    };
    return WordListCache;
}());
exports.wordCachList = new WordListCache();
router.get("/filter", function (req, res) {
    var searchParams = req.query;
    var results = (0, mysql_1.findAlumni)(searchParams);
    results.then(function (result) {
        res.send(result);
    });
    for (var i in exports.wordCachList.words) {
        console.log(exports.wordCachList.words[i]);
    }
});
router.get("/search", function (req, res) {
    var search = req.query.query;
    exports.wordCachList.update();
});
var distance_between_words_1 = require("../helper/distance_between_words");
var x = ["localy", "locely", "loccally", "locali"];
for (var i in x) {
    console.log((0, distance_between_words_1.distance)(x[i], "locally"));
}
module.exports = router;
