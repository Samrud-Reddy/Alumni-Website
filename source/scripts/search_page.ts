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
	let search_parm: any = {};

	for (let i = 0; i < 7; i = i + 1) {
		let curr_elem = $(".smallText>input[type='text']").eq(i);
		let indentifier: string = curr_elem.attr("name") || "";

		search_parm[indentifier] = curr_elem.val()?.toString() || "";
	}
}

function searchFromBar() {
	let text: string = $("#big_searchbar").val()?.toString() || "";
}
