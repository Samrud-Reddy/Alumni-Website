"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.has = exports.add = exports.make_random_num = void 0;
var fs_1 = __importDefault(require("fs"));
function readStates() {
    var _a;
    var contents = fs_1.default.readFileSync(((_a = require.main) === null || _a === void 0 ? void 0 : _a.path) + "\\states.json", "utf-8");
    var data = JSON.parse(contents);
    if (!Array.isArray(data)) {
        throw new Error("JSON file does not contain a list");
    }
    return data;
}
function appendStates(x) {
    var _a;
    var states = readStates();
    states.push(x);
    var json = JSON.stringify(states);
    fs_1.default.writeFile(((_a = require.main) === null || _a === void 0 ? void 0 : _a.path) + "\\states.json", json, function (err) {
        if (err)
            throw err;
    });
}
function write(x) {
    var _a;
    fs_1.default.writeFile(((_a = require.main) === null || _a === void 0 ? void 0 : _a.path) + "\\states.json", x, function (err) {
        if (err)
            throw err;
    });
}
var crypto_1 = require("crypto");
function make_random_num(x) {
    var state;
    var randomnumber = (0, crypto_1.getRandomValues)(new BigInt64Array(x || 16));
    state =
        (0, crypto_1.createHash)("sha256")
            .update(randomnumber.slice(0, randomnumber.length / 2).toString())
            .digest("base64url")
            .toString() +
            (0, crypto_1.createHash)("sha256")
                .update(randomnumber
                .slice(randomnumber.length / 2, randomnumber.length)
                .toString())
                .digest("base64url")
                .toString();
    return state;
}
exports.make_random_num = make_random_num;
function add() {
    var x = make_random_num(16);
    appendStates(x);
    return x;
}
exports.add = add;
function has(x) {
    var states = readStates();
    return states.includes(x);
}
exports.has = has;
function remove(x) {
    var states = readStates();
    states = states.filter(function (item) { return item !== x; });
    write(JSON.stringify(states));
}
exports.remove = remove;
