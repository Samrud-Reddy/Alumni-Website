function WeShouldNotRunDistance(str1: string, str2: string): boolean {
	let lstr1, lstr2;
	str1 = str1.toLowerCase();
	str2 = str2.toLowerCase();
	lstr1 = str1.length;
	lstr2 = str2.length;

	if (Math.abs(lstr1 - lstr2) > 3) {
		return true;
	}

	if (lstr1 >= 2 && lstr2 >= 2) {
		if (str1.slice(0, 2) != str2.slice(0, 2)) {
			return true;
		}
	}

	return false;
}

export function distance(str1: string, str2: string): number {
	if (WeShouldNotRunDistance(str1, str2)) {
		return 10;
	}

	let d = [];

	let lstr1: number = str1.length;
	let lstr2: number = str2.length;
	let temp: any[];
	for (let i = 0; i <= lstr1; i++) {
		temp = [];
		for (let j = 0; j <= lstr2; j++) {
			temp.push(0);
		}
		d.push(temp);
	}

	for (let i = 0; i <= lstr1; i++) {
		d[i][0] = i;
	}
	for (let j = 0; j <= lstr2; j++) {
		d[0][j] = j;
	}

	let cost;

	for (let i = 1; i <= lstr1; i++) {
		for (let j = 1; j <= lstr2; j++) {
			if (str1[i - 1] == str2[j - 1]) {
				cost = 0;
			} else {
				cost = 1;
			}

			d[i][j] = Math.min(
				d[i - 1][j] + 1,
				d[i][j - 1] + 1,
				d[i - 1][j - 1] + cost
			);

			if (
				i > 1 &&
				j > 1 &&
				str1[i - 1] === str2[j - 2] &&
				str1[i - 2] === str2[j - 1]
			) {
				d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
			}
		}
	}

	return d[lstr1][lstr2];
}
