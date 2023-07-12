"use strict";
$("#big_searchbar").on("keypress", function (e) {
    if (e.key === "Enter") {
        searchFromBar();
    }
});
function getCurrentUrl() {
    var getCurrentUrl = new URL(window.location.href);
    return getCurrentUrl.origin;
}
function cleanInput(text) {
    text = text.toLowerCase();
    var pattern = /[a-z0-9 ]/g;
    var textMatches = text.match(pattern) || [];
    text = textMatches.join("");
    textMatches = text.split(" ");
    var finalWordList = [];
    for (var i in textMatches) {
        if (textMatches[i] != "") {
            finalWordList.push(textMatches[i]);
        }
    }
    return finalWordList;
}
function searchFromBar() {
    var _a;
    var text = ((_a = $("#big_searchbar").val()) === null || _a === void 0 ? void 0 : _a.toString()) || "";
    var curr_url = new URL("results/search", getCurrentUrl());
    text = cleanInput(text).join(" ");
    curr_url.searchParams.append("query", text);
    window.location.href = curr_url.toString();
}
