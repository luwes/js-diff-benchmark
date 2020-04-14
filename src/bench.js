const fs = require('fs');
const c = require('ansi-colors');
var Terser = require('terser');
const gzipSize = require('gzip-size');

const {Dommy, Nody, get} = require('./dommy.js');

let parent = new Dommy();

const libs = [
  'list-difference',
  'snabbdom',
  'udomdiff',
  'stage0',
  // 'heckel',
];

let rows;
let out;

libs.forEach(lib => {
  const file = `libs/${lib}.js`;
  const diff = require(`../${file}`);

  var code = fs.readFileSync(file, 'utf8');
  var gzip = gzipSize.sync(Terser.minify(code).code);
  console.log(`${c.bgGreen.black(` ${lib.toUpperCase()} ${gzip}B `)}\n`);

  //* warm up + checking everything works upfront
  create1000(parent, diff);
  console.assert(parent.childNodes.length === 1000);
  append1000(parent, diff);
  console.assert(parent.childNodes.length === 2000);
  clear(parent, diff);
  console.assert(parent.childNodes.length === 0);
  create10000(parent, diff);
  console.assert(parent.childNodes.length === 10000);
  clear(parent, diff);
  console.assert(parent.childNodes.length === 0);
  create1000(parent, diff);
  swapRows(parent, diff);
  console.assert(parent.childNodes[1].value == 998);
  console.assert(parent.childNodes[998].value == 1);
  clear(parent, diff);
  create1000(parent, diff);
  updateEach10thRow(parent, diff);
  console.assert(/!$/.test(parent.childNodes[0].value));
  console.assert(!/!$/.test(parent.childNodes[1].value));
  console.assert(/!$/.test(parent.childNodes[10].value));
  clear(parent, diff);
  console.assert(parent.childNodes.length === 0);
  //*/

  console.time(lib.toUpperCase());

  // actual benchmark
  parent.reset();
  console.time('create 1000');
  rows = create1000(parent, diff);
  console.timeEnd('create 1000');
  console.assert(parent.childNodes.every((row, i) => row === rows[i]));
  console.log('operations', parent.count(), '\n');
  parent.reset();

  console.time('clear');
  rows = clear(parent, diff);
  console.timeEnd('clear');
  console.assert(parent.childNodes.every((row, i) => row === rows[i]) && rows.length === 0);
  console.log('operations', parent.count(), '\n');
  parent.reset();

  create1000(parent, diff);
  parent.reset();
  console.time('replace 1000');
  rows = create1000(parent, diff);
  console.timeEnd('replace 1000');
  console.assert(parent.childNodes.every((row, i) => row === rows[i]));
  console.log('operations', parent.count(), '\n');
  clear(parent, diff);
  parent.reset();

  create1000(parent, diff);
  parent.reset();
  console.time('append 1000');
  rows = append1000(parent, diff);
  console.timeEnd('append 1000');
  console.assert(parent.childNodes.every((row, i) => row === rows[i]) && rows.length === 2000);
  console.log('operations', parent.count(), '\n');
  parent.reset();

  console.time('append more');
  rows = append1000(parent, diff);
  console.timeEnd('append more');
  console.assert(parent.childNodes.every((row, i) => row === rows[i]) && rows.length === 3000);
  console.log('operations', parent.count(), '\n');
  parent.reset();
  clear(parent, diff);

  create1000(parent, diff);
  parent.reset();
  console.time('swap rows');
  swapRows(parent, diff);
  console.timeEnd('swap rows');
  out = ['operations', parent.count()];
  if (parent.count() > 2) {
    out.push(`${c.bgRed.black(`+${parent.count() - 2}`)}`);
  }
  console.log(...out, '\n');
  parent.reset();

  create1000(parent, diff);
  parent.reset();
  console.time('update every 10th row');
  updateEach10thRow(parent, diff);
  console.timeEnd('update every 10th row');
  out = ['operations', parent.count()];
  if (parent.count() > 100) {
    out.push(`${c.bgRed.black(`+${parent.count() - 100}`)}`);
  }
  console.log(...out, '\n');
  parent.reset();

  clear(parent, diff);
  parent.reset();
  console.time('create 10000 rows');
  create10000(parent, diff);
  console.timeEnd('create 10000 rows');
  console.log('operations', parent.count(), '\n');
  parent.reset();

  console.time('swap over 10000 rows');
  swapRows(parent, diff);
  console.timeEnd('swap over 10000 rows');
  out = ['operations', parent.count()];
  if (parent.count() > 2) {
    out.push(`${c.bgRed.black(`+${parent.count() - 2}`)}`);
  }
  console.log(...out, '\n');
  parent.reset();

  console.time('clear 10000');
  clear(parent, diff);
  console.timeEnd('clear 10000');
  out = ['operations', parent.count()];
  if (parent.count() > 10002) {
    out.push(`${c.bgRed.black(`+${parent.count() - 10002}`)}`);
  }
  console.log(...out, '\n');
  parent.reset();

  //*/

  console.timeEnd(lib.toUpperCase());
  console.log('\n*******************************************\n');
});


function append1000(parent, diff) {
  const start = parent.childNodes.length - 1;
  const childNodes = parent.childNodes.slice();
  for (let i = 0; i < 1000; i++)
    childNodes.push(new Nody(parent, start + i));
  return diff(
    parent,
    parent.childNodes,
    childNodes,
    get,
    parent.lastElementChild
  );
}

function clear(parent, diff) {
  return diff(
    parent,
    parent.childNodes,
    [],
    get,
    parent.lastElementChild
  );
}

function create1000(parent, diff) {
  const start = parent.childNodes.length;
  const childNodes = [];
  for (let i = 0; i < 1000; i++)
    childNodes.push(new Nody(parent, start + i));
  return diff(
    parent,
    parent.childNodes,
    childNodes,
    get,
    parent.lastElementChild
  );
}

function create10000(parent, diff) {
  const childNodes = [];
  for (let i = 0; i < 10000; i++)
    childNodes.push(new Nody(parent, i));
  return diff(
    parent,
    parent.childNodes,
    childNodes,
    get,
    parent.lastElementChild
  );
}

function swapRows(parent, diff) {
  const childNodes = parent.childNodes.slice();
  const $1 = childNodes[1];
  childNodes[1] = childNodes[998];
  childNodes[998] = $1;
  return diff(
    parent,
    parent.childNodes,
    childNodes,
    get,
    parent.lastElementChild
  );
}

function updateEach10thRow(parent, diff) {
  const childNodes = parent.childNodes.slice();
  for (let i = 0; i < childNodes.length; i += 10)
    childNodes[i] = new Nody(parent, i + '!');
  return diff(
    parent,
    parent.childNodes,
    childNodes,
    get,
    parent.lastElementChild
  );
}
