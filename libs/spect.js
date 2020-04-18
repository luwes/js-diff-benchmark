module.exports = function merge (parent, a, b) {
  let i, j, ai, bj, bprevNext = a[0], bidx = new Set(b), aidx = new Set(a)

  for (i = 0, j = 0; j <= b.length; i++, j++) {
    ai = a[i], bj = b[j]

    if (ai === bj) {}

    else if (ai && !bidx.has(ai)) {
      // replace
      if (bj && !aidx.has(bj)) parent.replaceChild(bj, ai)

      // remove
      else (parent.removeChild(ai), j--)
    }
    else if (bj) {
      // move - skips bj for the following swap
      if (!aidx.has(bj)) i--

      // insert after bj-1, bj
      parent.insertBefore(bj, bprevNext)
    }

    bprevNext = bj && bj.nextSibling
  }

  return b
}
