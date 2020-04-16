module.exports = function diff(parent, a, b, before) {
  const bmap = new Map(),
    amap = new Map(),
    nextSibling = Array(a.length);
  let i, j, ai, bj, ij, ji, previj, cur;

  // create index
  for (i = 0; i < b.length; i++) bmap.set(b[i], i);
  for (i = 0; i < a.length; i++) amap.set(a[i], i);

  // align items
  for (i = 0, j = 0; i < a.length || j < b.length; i++, j++) {
    (ai = a[i]), (bj = b[j]), (ij = bmap.get(ai)), (ji = amap.get(bj));

    // replaced
    if (ai != null && bj != null && ij == null && ji == null) {
      parent.replaceChild(bj, ai);
      nextSibling[j] = a[i + 1];
      nextSibling[j - 1] = bj;
    }
    // removed
    else if (ai != null && ij == null) {
      parent.removeChild(ai);
      nextSibling[previj] = a[i + 1];
      j--;
    }
    // added
    else if (bj != null && ji == null) {
      parent.insertBefore(bj, (nextSibling[j] = ai || before));
      nextSibling[j - 1] = bj;
      i--;
    }
    // moved
    else {
      nextSibling[ij] = a[i + 1];
    }

    previj = ij;
  }

  // reorder
  for (cur = before, j = b.length; j--; ) {
    bj = b[j];
    if (nextSibling[j] != cur) {
      parent.insertBefore(bj, cur);
    }
    cur = bj;
  }

  return b;
};
