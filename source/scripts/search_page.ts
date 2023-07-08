function open_model(open: boolean) {
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
