let obj = {};
let prop = {};
function init() {
	fetch("objects.json")
		.then(res => res.json())
		.then(json => {
			obj = json.objects;
			prop = json.properties;
			document.body.innerHTML = "";
			createBase();
			createNode("universe");
			return json;
		});
	// .then(json => console.log(json));
}

init();

function createNode(id, parent = "everything", props = "") {
	let x = getFreeId();

	let span = $$("span");
	span.className = "unopened";
	span.id = "s" + x;
	span.innerText = obj[id].name;
	span.setAttribute("data-props", props);
	let s = props.split(/\s/);
	try {
		s = s.map(e => prop[e].name);
	} catch (e) {
		if (s[0] != "") console.error("Unknown property!");
		s = [];
	}
	if (s.length > 0) span.innerText = s.join(" ") + " " + span.innerText;

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
					if (i.parentProps) pstr = parentProps.replace(/\*/g, "");
					else if (i.props) {
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
			if (i.parentProps) pstr = parentProps.replace(/\*/g, "");
			else if (x.props) {
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
