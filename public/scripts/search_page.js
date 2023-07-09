"use strict";
function open_model(open) {
    if (open) {
        $(".filterPopup").show();
        $(".opacityHider").show();
    }
    if (!open) {
        $(".filterPopup").hide();
        $(".opacityHider").hide();
    }
}
$("#big_searchbar").on("keydown", function (e) {
    if (e.key === "Enter") {
        searchFromBar();
    }
});
$("body").on("keydown", function (e) {
    if (e.key === "Escape") {
        open_model(false);
    }
});
function getCurrentUrl() {
    var getCurrentUrl = new URL(window.location.href);
    return getCurrentUrl.origin;
}
function searchFromFilter() {
    var _a, _b;
    var curr_url = new URL("results/filter", getCurrentUrl());
    for (var i = 0; i < 7; i = i + 1) {
        var curr_elem = $(".smallText>input[type='text']").eq(i);
        var indentifier = ((_a = curr_elem.attr("name")) === null || _a === void 0 ? void 0 : _a.toString()) || "";
        var value = ((_b = curr_elem.val()) === null || _b === void 0 ? void 0 : _b.toString()) || "";
        curr_url.searchParams.append(indentifier, value);
    }
    window.location.href = curr_url.toString();
}
function searchFromBar() {
    var _a;
    var text = ((_a = $("#big_searchbar").val()) === null || _a === void 0 ? void 0 : _a.toString()) || "";
    var curr_url = new URL("results/search", getCurrentUrl());
    curr_url.searchParams.append("query", text);
    window.location.href = curr_url.toString();
}
