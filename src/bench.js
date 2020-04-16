const fs = require('fs');
const c = require('ansi-colors');
var Terser = require('terser');
const gzipSize = require('gzip-size');
const Table = require('cli-table');
const microtime = require('microtime');

const { Dommy, Nody } = require('./dommy.js');

let parent = new Dommy();

const libs = [
  'heckel',
  'stage0',
  'spect',
  'list-difference',
  'snabbdom',
  'udomdiff',
];

const cols = [
  '',
  '1k',
  'Shufle',
  'Invers',
  'Clear',
  'Append',
  'Swap2',
  'Up10th',
  '10k',
  'Swap2',
  'Total',
  'Size',
];
const table = new Table({
  head: cols,
  colAligns: cols.map(() => 'middle'),
  style: {
    head: ['green'],
  },
});

let rows;
let shuffleSeed;

libs.forEach((lib) => {
  const libResults = [];
  table.push({ [lib.slice(0, 7)]: libResults });

  const file = `libs/${lib}.js`;
  const diff = require(`../${file}`);

  var code = fs.readFileSync(file, 'utf8');
  var gzip = gzipSize.sync(Terser.minify(code).code);

  //* warm up + checking everything works upfront
  create1000(parent, diff);
  console.assert(parent.childNodes.length === 1000);

  if (!shuffleSeed) {
    // create a fixed shuffled seed so each library does the same.
    const shuffle = Array.from(parent.childNodes).sort(
      () => Math.random() - Math.random()
    );
    shuffleSeed = shuffle.map((node) => parent.childNodes.indexOf(node));
  }

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

  // console.time(lib.toUpperCase());

  const totalStart = microtime.now();

  let begin;
  const start = () => (begin = microtime.now());
  const stop = (count, operationMax) => {
    const delta = parent.count() - operationMax;
    libResults.push(`${round((microtime.now() - begin) / 1000)}ms
${c.gray(parent.count())}${
      count > operationMax
        ? (delta > 99 ? '\n' : ' ') + c.bgRed.black(`+${delta}`)
        : ''
    }`);
  };

  // actual benchmark
  parent.reset();
  start();
  rows = create1000(parent, diff);
  stop(parent.count(), 1000);
  console.assert(
    parent.childNodes.every((row, i) => row === rows[i]),
    '%s 1k',
    lib
  );
  parent.reset();

  start();
  rows = random(parent, diff);
  stop(parent.count(), 1000);
  console.assert(
    parent.childNodes.every((row, i) => row === rows[i]),
    '%s random',
    lib
  );
  parent.reset();

  start();
  rows = reverse(parent, diff);
  stop(parent.count(), 1000);
  console.assert(
    parent.childNodes.every((row, i) => row === rows[i]),
    '%s reverse',
    lib
  );
  parent.reset();

  start();
  rows = clear(parent, diff);
  stop(parent.count(), 1000);
  console.assert(
    parent.childNodes.every((row, i) => row === rows[i]) && rows.length === 0,
    '%s clear',
    lib
  );
  parent.reset();

  create1000(parent, diff);
  parent.reset();
  rows = create1000(parent, diff);
  console.assert(parent.childNodes.every((row, i) => row === rows[i]));
  clear(parent, diff);
  parent.reset();

  create1000(parent, diff);
  parent.reset();
  start();
  rows = append1000(parent, diff);
  stop(parent.count(), 1000);
  console.assert(
    parent.childNodes.every((row, i) => row === rows[i]) &&
      rows.length === 2000,
    '%s append 1k',
    lib
  );
  parent.reset();

  rows = append1000(parent, diff);
  console.assert(
    parent.childNodes.every((row, i) => row === rows[i]) && rows.length === 3000
  );
  parent.reset();
  clear(parent, diff);

  create1000(parent, diff);
  parent.reset();
  start();
  rows = swapRows(parent, diff);
  console.assert(parent.childNodes.every((row, i) => row === rows[i]));
  stop(parent.count(), 2);
  parent.reset();

  create1000(parent, diff);
  parent.reset();
  start();
  updateEach10thRow(parent, diff);
  stop(parent.count(), 200);
  parent.reset();

  clear(parent, diff);
  parent.reset();
  start();
  create10000(parent, diff);
  stop(parent.count(), 10000);
  parent.reset();

  start();
  swapRows(parent, diff);
  stop(parent.count(), 2);
  parent.reset();

  clear(parent, diff);
  parent.reset();

  //*/

  libResults.push(`${round((microtime.now() - totalStart) / 1000)}ms`);
  libResults.push(`${gzip}B`);

  // const used = process.memoryUsage().heapUsed / 1024 / 1024;
  // console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);

  try {
    if (global.gc) {
      global.gc();
    }
  } catch (e) {
    process.exit();
  }
});

table.sort((a, b) => {
  a = Object.values(a)[0];
  b = Object.values(b)[0];
  return parseInt(a[a.length - 2]) - parseInt(b[b.length - 2]);
});

console.log(table.toString());

function round(num) {
  return Math.round((num + Number.EPSILON) * 10) / 10;
}

function random(parent, diff) {
  return diff(
    parent,
    parent.childNodes,
    shuffleSeed.map((newIdx) => parent.childNodes[newIdx]),
    parent.lastElementChild
  );
}

function reverse(parent, diff) {
  return diff(
    parent,
    parent.childNodes,
    Array.from(parent.childNodes).reverse(),
    parent.lastElementChild
  );
}

function append1000(parent, diff) {
  const start = parent.childNodes.length - 1;
  const childNodes = parent.childNodes.slice();
  for (let i = 0; i < 1000; i++) childNodes.push(new Nody(parent, start + i));
  return diff(parent, parent.childNodes, childNodes, parent.lastElementChild);
}

function clear(parent, diff) {
  return diff(parent, parent.childNodes, [], parent.lastElementChild);
}

function create1000(parent, diff) {
  const start = parent.childNodes.length;
  const childNodes = [];
  for (let i = 0; i < 1000; i++) childNodes.push(new Nody(parent, start + i));
  return diff(parent, parent.childNodes, childNodes, parent.lastElementChild);
}

function create10000(parent, diff) {
  const childNodes = [];
  for (let i = 0; i < 10000; i++) childNodes.push(new Nody(parent, i));
  return diff(parent, parent.childNodes, childNodes, parent.lastElementChild);
}

function swapRows(parent, diff) {
  const childNodes = parent.childNodes.slice();
  const $1 = childNodes[1];
  childNodes[1] = childNodes[998];
  childNodes[998] = $1;
  return diff(parent, parent.childNodes, childNodes, parent.lastElementChild);
}

function updateEach10thRow(parent, diff) {
  const childNodes = parent.childNodes.slice();
  for (let i = 0; i < childNodes.length; i += 10)
    childNodes[i] = new Nody(parent, i + '!');
  return diff(parent, parent.childNodes, childNodes, parent.lastElementChild);
}
