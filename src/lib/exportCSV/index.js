import saveAs from 'file-saver';

export default (data, filename) => {
	var blob = new Blob([toCsv(pivot(data))], {
		type: 'text/csv;charset=utf-8;'
	});
	saveAs(blob, `${filename}.csv`);
};

function pivot(arr) {
	var mp = new Map();

	function setValue(a, path, val) {
		if (Object(val) !== val) {
			// primitive value
			var pathStr = path.join('.');
			var i = (mp.has(pathStr) ? mp : mp.set(pathStr, mp.size)).get(pathStr);
			a[i] = val;
		} else {
			for (var key in val) {
				setValue(a, key == '0' ? path : path.concat(key), val[key]);
			}
		}
		return a;
	}

	var result = arr.map((obj) => setValue([], [], obj));
	return [[...mp.keys()], ...result];
}

function toCsv(arr) {
	return arr
		.map((row) => row.map((val) => (isNaN(val) ? JSON.stringify(val) : +val)).join(','))
		.join('\n');
}
