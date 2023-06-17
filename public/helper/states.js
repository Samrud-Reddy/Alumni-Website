"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.States = exports.State_class = void 0;
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
var State_class = /** @class */ (function () {
    function State_class() {
        this.states = [];
    }
    State_class.prototype.remove = function (id) {
        var index;
        if (typeof id === "object") {
            index = this.states.indexOf(id);
        }
        if (typeof id === "string") {
            for (var _i = 0, _a = this.states; _i < _a.length; _i++) {
                var item = _a[_i];
                if (item.stateId === id) {
                    index = this.states.indexOf(item);
                    break;
                }
            }
        }
        this.states.filter(function (state, i) { return i !== index; });
    };
    State_class.prototype.makeRandomNum = function (lenght) {
        return make_random_num(lenght);
    };
    State_class.prototype.addState = function (used_for) {
        var id = this.makeRandomNum(16);
        var stateOBJ = {
            time_of_creation: Date.now(),
            used_for: used_for,
            stateId: id,
        };
        this.states.push(stateOBJ);
        return id;
    };
    State_class.prototype.has = function (id, used_for) {
        var _this = this;
        var inStates = false;
        var toRemove = [];
        for (var i = 0; i < this.states.length; i++) {
            var currentStateObj = this.states[i];
            var lifeTime = Date.now() - currentStateObj.time_of_creation;
            if (lifeTime >= 10 * 60 * 1000) {
                toRemove.push(this.states[i]);
            }
            else if (currentStateObj.stateId === id &&
                currentStateObj.used_for === used_for) {
                inStates = true;
            }
        }
        toRemove.forEach(function (element) {
            _this.remove(element);
        });
        return inStates;
    };
    return State_class;
}());
exports.State_class = State_class;
exports.States = new State_class();
