"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllForCache = exports.findAlumni = exports.isAlumini = exports.isTeacher = exports.verifyAndAddUser = void 0;
require("dotenv").config();
var knex = require("knex")({
    client: "mysql",
    connection: {
        host: process.env.SQL_host || "localhost",
        port: process.env.SQL_PORT || "3306",
        user: "root",
        password: process.env.SQL_pwd || "1xd`1ox0Vk",
        database: process.env.SQL_database_name || "alumini_website",
    },
});
function verifyAndAddUser(user) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, knex("users")
                    .select("*")
                    .where({ email: user.email })
                    .then(function (rows) {
                    if (rows.length !== 0) {
                        return "USER_EXISTS";
                    }
                    var resultOfSQL = knex("users").insert(user);
                    return resultOfSQL.then(function (rows) {
                        return "redirect";
                    });
                })];
        });
    });
}
exports.verifyAndAddUser = verifyAndAddUser;
function isTeacher(email) {
    return __awaiter(this, void 0, void 0, function () {
        var teachers;
        return __generator(this, function (_a) {
            teachers = knex("teachers").select("*").where({ email: email });
            return [2 /*return*/, teachers.then(function (rows) {
                    return rows.length > 0;
                })];
        });
    });
}
exports.isTeacher = isTeacher;
function isAlumini(email) {
    return __awaiter(this, void 0, void 0, function () {
        var teachers;
        return __generator(this, function (_a) {
            teachers = knex("users").select("*").where({ email: email });
            return [2 /*return*/, teachers.then(function (rows) {
                    return rows.length > 0;
                })];
        });
    });
}
exports.isAlumini = isAlumini;
function findAlumni(searchParams) {
    return __awaiter(this, void 0, void 0, function () {
        function andWhere() {
            for (var i in fixedParms) {
                var param = fixedParms[i];
                this.orWhere(param[0], param[1]);
            }
        }
        var fixedParms, key, results;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fixedParms = [];
                    for (key in searchParams) {
                        if (searchParams[key] !== "") {
                            fixedParms.push([key, searchParams[key]]);
                        }
                    }
                    results = knex("users")
                        .select("*")
                        .where({ mentor: true })
                        .andWhere(andWhere);
                    return [4 /*yield*/, results];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.findAlumni = findAlumni;
function getAllForCache(ord) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, knex("users")
                        .select("id", "name", "college", "major", "job", "country", "city")
                        .where("id", ">", ord)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.getAllForCache = getAllForCache;
// let user = {
// 	name: "Hello",
// 	email: "usser@gmail.com",
// 	gradyear: 2002,
// 	college: "MIT",
// 	major: "lit",
// 	country: "ind",
// 	city: "bng",
// 	mentor: true,
// };
