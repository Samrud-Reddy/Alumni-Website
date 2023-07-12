$("#big_searchbar").on("keypress", function (e) {
	if (e.key === "Enter") {
		searchFromBar();
	}
});

function getCurrentUrl(): string {
	let getCurrentUrl = new URL(window.location.href);
	return getCurrentUrl.origin;
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
