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
function searchFromFilter() {
    var _a;
    var search_parm = {};
    for (var i = 0; i < 7; i = i + 1) {
        var curr_elem = $(".smallText>input[type='text']").eq(i);
        var indentifier = curr_elem.attr("name") || "";
        search_parm[indentifier] = ((_a = curr_elem.val()) === null || _a === void 0 ? void 0 : _a.toString()) || "";
    }
}
function searchFromBar() {
    var _a;
    var text = ((_a = $("#big_searchbar").val()) === null || _a === void 0 ? void 0 : _a.toString()) || "";
}
