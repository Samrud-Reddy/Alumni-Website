let isModelOpen = false;

function open_model(open: boolean) {
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
	let curr_url = new URL("results/filter", getCurrentUrl());

	for (let i = 0; i < 7; i = i + 1) {
		let curr_elem = $(".smallText>input[type='text']").eq(i);
		let indentifier: string = curr_elem.attr("name")?.toString() || "";
		let value: string = curr_elem.val()?.toString() || "";

		curr_url.searchParams.append(indentifier, value);
	}

	window.location.href = curr_url.toString();
}

$("body").on("keydown", function (e) {
	if (e.key === "Escape") {
		open_model(false);
	}
});
