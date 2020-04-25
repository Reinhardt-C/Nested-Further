let obj = {};
let prop = {};
function init() {
	fetch("objects.json")
		.then(res => res.json())
		.then(json => {
			obj = json.objects;
			prop = json.properties;
			document.body.innerHTML = "Nested Further - v0.1.0<hr>";
			createBase();
			createNode("universe", "everything");
			return json;
		});
	// .then(json => console.log(json));
}

init();

// Consonants
// ["B", "C", "D", "F", "G", "H", "J", "K", "L", "M", "N", "P", "R", "S", "T", "V", "W", "X", "Y", "Z", "Th", "Sh", "Ch", "Sm", "Sn", "St", "Sw", "Sk", "Sl", "Sp", "Sf", "Thw", "Dw", "Tw", "Thr", "Dr", "Tr", "Qu", "Cr", "Cl", "Pr", "Fr", "Br", "Gr", "Pl", "Fl", "Bl", "Gl", "Shr", "Spl", "Spr", "Str", "Scr", "Squ"]
// ["b", "c", "d", "f", "g", "h", "j", "k", "l", "m", "n", "p", "r", "s", "t", "v", "w", "x", "y", "z", "th", "sh", "ch", "sm", "sn", "st", "sw", "sk", "sl", "sp", "sf", "thw", "dw", "tw", "thr", "dr", "tr", "qu", "cr", "cl", "pr", "fr", "br", "gr", "pl", "fl", "bl", "gl", "shr", "spl", "spr", "str", "scr", "squ"]
// Vowels
// ["A", "E", "I", "O", "U", "Ae", "Ai", "Ao", "Ei", "Ee", "Oi", "Ou", "Oo"]
// ["a", "e", "i", "o", "u", "ae", "ai", "ao", "ei", "ee", "oi", "ou", "oo"]
// Both
// ["B", "C", "D", "F", "G", "H", "J", "K", "L", "M", "N", "P", "R", "S", "T", "V", "W", "X", "Y", "Z", "Th", "Sh", "Ch", "Sm", "Sn", "St", "Sw", "Sk", "Sl", "Sp", "Sf", "Thw", "Dw", "Tw", "Thr", "Dr", "Tr", "Qu", "Cr", "Cl", "Pr", "Fr", "Br", "Gr", "Pl", "Fl", "Bl", "Gl", "Shr", "Spl", "Spr", "Str", "Scr", "Squ", "A", "E", "I", "O", "U", "Ae", "Ai", "Ao", "Ei", "Ee", "Oi", "Ou", "Oo"]
// ["b", "c", "d", "f", "g", "h", "j", "k", "l", "m", "n", "p", "r", "s", "t", "v", "w", "x", "y", "z", "th", "sh", "ch", "sm", "sn", "st", "sw", "sk", "sl", "sp", "sf", "thw", "dw", "tw", "thr", "dr", "tr", "qu", "cr", "cl", "pr", "fr", "br", "gr", "pl", "fl", "bl", "gl", "shr", "spl", "spr", "str", "scr", "squ", "a", "e", "i", "o", "u", "ae", "ai", "ao", "ei", "ee", "oi", "ou", "oo"]

function createNode(id, parent = "everything", props = "") {
	let x = getFreeId();

	let span = $$("span");
	span.className = "unopened";
	span.id = "s" + x;
	if (obj[id].randName) {
		let name = randName(obj[id].randName);
		span.innerText = name;
	} else span.innerText = obj[id].name;
	span.setAttribute("data-props", props);
	let s = props.split(/\s/);
	try {
		s = s.map(e => prop[e].name);
	} catch (e) {
		if (s[0] != "") console.error("Unknown property!");
		s = [];
	}
	s = s.filter(e => e !== "");
	if (s.length > 0) span.innerText = s.join(" ") + (s.join(" ").length > 0 ? " " : "") + span.innerText;

	let li = $$("li");
	let ul = $$("ul");
	ul.id = x;
	ul.className = "active";

	li.appendChild(span);
	li.appendChild(ul);

	span.onclick = () => {
		if ($("s" + x).className == "unopened") {
			handleChildren(id, x);
			$("s" + x).className = "open";
		} else if ($("s" + x).className == "closed") {
			$("s" + x).className = "open";
			$(x).className = "active";
		} else if ($("s" + x).className == "open") {
			$("s" + x).className = "closed";
			$(x).className = "nested";
		}
	};

	$(parent).appendChild(li);
	return span;
}

function randName(pattern) {
	let name = "";
	for (let i of pattern) {
		let temp = chooseRandom(i);
		if (!name.endsWith(" ") || /^[A-Z]/.test(temp)) name += temp;
	}
	return name;
}

function handleChildren(id, parent) {
	let num = randBetween(obj[id].contentsCount[0], obj[id].contentsCount[1]);
	let parentProps = $("s" + parent).getAttribute("data-props");
	if (obj[id].certainContents) {
		for (let k in obj[id].certainContents) {
			let i = obj[id].certainContents[k];
			if (testChild(id, parentProps, k))
				for (let j = 0; j < i.count; j++) {
					let pstr = "";
					let exclude = "";
					if (i.parentProps) pstr = parentProps.replace(/\*|((\s|^)\w+-)(\s|$)/g, "");
					if (i.props) {
						for (let j of i.props) {
							if (exclude.includes(j.id)) {
								continue;
							}
							if (Math.random() < j.chance) {
								exclude += (exclude.length > 0 ? " " : "") + j.excludes;
								pstr += (pstr.length > 0 ? " " : "") + j.id;
							}
						}
					}
					createNode(i.id, parent, pstr || "");
				}
		}
	}
	// console.log($("s" + parent).getAttribute("data-props"));
	for (let i = 0; i < num; i++) {
		let parentProps = $("s" + parent).getAttribute("data-props");
		let x = getRandChild(id, parentProps);
		let pstr = "";
		let exclude = "";
		if (x) {
			if (x.parentProps) pstr = parentProps.replace(/\*|((\s|^)\w+-)(\s|$)/g, "");
			if (x.props) {
				let a = x.props;
				a = a.filter(e => {
					if (e.if) {
						let t = e.if.split(/\s/);
						for (let i of t)
							if (!parentProps.split(" ").includes(i)) {
								return false;
								break;
							}
						return true;
					}
					if (e.ifNot) {
						let t = e.ifNot.split(/\s/);
						for (let i of t)
							if (parentProps.split(" ").includes(i)) {
								return false;
								break;
							}
						return true;
					}
					return true;
				});
				for (let j of a) {
					if (exclude.split(" ").includes(j.id)) {
						continue;
					}
					if (Math.random() < j.chance) {
						exclude += (exclude.length > 0 ? " " : "") + j.excludes;
						pstr += (pstr.length > 0 ? " " : "") + j.id;
					}
				}
			}
			createNode(x.id, parent, pstr || "");
		}
	}
}

function getRandChild(id, parentProps) {
	let a = obj[id].contents;
	a = a.filter(x => {
		if (x.if) {
			let t = x.if.split(/\s/);
			for (let i of t)
				if (!parentProps.split(" ").includes(i)) {
					return false;
					break;
				}
			return true;
		}
		if (x.ifNot) {
			let t = x.ifNot.split(/\s/);
			for (let i of t)
				if (parentProps.split(" ").includes(i)) {
					return false;
					break;
				}
			return true;
		}
		return true;
	});
	return chooseWeighted(a);
}

function testChild(id, parentProps, index) {
	let a = obj[id].certainContents;
	a = a.map(x => {
		if (x.if) {
			let t = x.if.split(/\s/);
			for (let i of t)
				if (!parentProps.split(" ").includes(i)) {
					return false;
					break;
				}
			return x;
		}
		if (x.ifNot) {
			let t = x.ifNot.split(/\s/);
			for (let i of t)
				if (parentProps.split(" ").includes(i)) {
					return false;
					break;
				}
			return x;
		}
		return x;
	});
	return a[index] !== false;
}

function chooseWeighted(items) {
	// StackOverflow code
	let chances = items.map(e => e.weight);
	var sum = chances.reduce((acc, el) => acc + el, 0);
	var acc = 0;
	chances = chances.map(el => (acc = el + acc));
	var rand = Math.random() * sum;
	return items[chances.filter(el => el <= rand).length] || items[0];
}

function chooseRandom(array) {
	return array[randBetween(0, array.length)];
}

function randBetween(min, max) {
	return Math.floor((max - min) * Math.random() + min);
}

let $ = id => document.getElementById(id);
let $$ = type => document.createElement(type);

function createBase() {
	let ul = $$("ul");
	ul.id = "everything";
	document.body.appendChild(ul);
}

let count = 0;

function getFreeId() {
	return count++;
}
