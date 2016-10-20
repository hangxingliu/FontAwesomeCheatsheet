var fs = require('fs'),
	path = require('path');

var faMap = require('./map'),
	faMapKey = [],	
	allNumber,	
	cutNumber;

var outputFile = path.join(__dirname, '../cheatsheet.html'),
	templateMain = fs.readFileSync(path.join(__dirname, 'template/main.html') , 'utf8'),
	templateTable = fs.readFileSync(path.join(__dirname, 'template/table.html') , 'utf8');

var replaceRegex = /\{\{\s+(\w+)\s+\}\}/g;

allNumber = 0;
for (var nm in faMap) {
	faMapKey.push(nm);
	allNumber++;
}
faMapKey.sort();
cutNumber = parseInt(allNumber / 4);

var blocks = [], content = '', i = 0;
for (var index in faMapKey) {
	var nm = faMapKey[index];
	content +=
		`<tr><td><i class="fa fa-lg ${nm}"></i></td><td>${nm}</td><td>${(typeof faMap[nm] == 'string' ? faMap[faMap[nm]] : faMap[nm]).join(', ')}</td></tr>\n`;
	i++;
	if ( !(i % cutNumber) || i >= allNumber) {
		blocks.push(templateTable.replace(replaceRegex, getReplaceFunction({
			content: content
		})));
		content = '';
	}
}

var html = templateMain.replace(replaceRegex, getReplaceFunction({
	updated: now(),
	insert0: blocks[0],
	insert1: blocks[1],
	insert2: blocks[2],
	insert3: blocks[3],
}) );

fs.writeFileSync(outputFile, html, 'utf8'), console.log('\n\u001b[32m    generated cheat sheet file success! \u001b[39m\n');

function now() {
	var n = new Date();
	return [n.getFullYear(), n.getMonth() + 1, n.getDate()].join('/');
}
function getReplaceFunction(context) {
	return (_, name) => context[name];
}