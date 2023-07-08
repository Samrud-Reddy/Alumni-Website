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
open_model(false);
