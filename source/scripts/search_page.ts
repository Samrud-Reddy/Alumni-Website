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

$("#big_searchbar").on("keypress", function (e) {
	if (e.key === "Enter") {
		searchFromBar();
	}
});

$("body").on("keydown", function (e) {
	if (e.key === "Escape") {
		open_model(false);
	}
});

function getCurrentUrl(): string {
	let getCurrentUrl = new URL(window.location.href);
	return getCurrentUrl.origin;
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

function cleanInput(text: string) {
	text = text.toLowerCase();
	let pattern: RegExp = /[a-z0-9 ]/g;
	let textMatches: Array<string> = text.match(pattern) || [];

	text = textMatches.join("");
	textMatches = text.split(" ");

	let finalWordList = [];
	for (let i in textMatches) {
		if (textMatches[i] != "") {
			finalWordList.push(textMatches[i]);
		}
	}

	return finalWordList;
}

function searchFromBar() {
	let text: string = $("#big_searchbar").val()?.toString() || "";
	let curr_url = new URL("results/search", getCurrentUrl());

	text = cleanInput(text).join(" ");

	curr_url.searchParams.append("query", text);

	window.location.href = curr_url.toString();
}
