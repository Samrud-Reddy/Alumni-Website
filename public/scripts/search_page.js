"use strict";
var isModelOpen = false;
function open_model(open) {
    if (isModelOpen !== open) {
        if (open) {
            isModelOpen = open;
            $(".filterPopup").show();
            $(".opacityHider").show();
        }
        if (!open) {
            isModelOpen = open;
            $(".filterPopup").hide();
            $(".opacityHider").hide();
        }
    }
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
$("body").on("keydown", function (e) {
    if (e.key === "Escape") {
        open_model(false);
    }
});
