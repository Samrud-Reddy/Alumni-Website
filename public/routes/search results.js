"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
router.get("/", function (req, res) {
    res.send("results");
});
router.get("/filter", function (req, res) {
    var searchParams = req.query;
    console.log(searchParams);
    res.send("filter");
});
router.get("/search", function (req, res) {
    res.send("search");
});
module.exports = router;
