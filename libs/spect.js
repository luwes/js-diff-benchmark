module.exports = function merge (parent, a, b, before) {
  let i, ai, bi, off, bidx = new Set(b), aidx = new Set(a)

  // walk by b from tail
  // a: 1 2 3 4 5, b: 1 2 3 → off: +2
  // ~i-- === i-- >= 0
  for (i = b.length, off = a.length - i; ~i--; ) {
    ai = a[i + off], bi = b[i]

    if (ai === bi) {}

    else if (ai && !bidx.has(ai)) {
      // replace (bi can be undefined in case of clearing the list)
      if (bi && !aidx.has(bi)) parent.replaceChild(bi, ai)

      // remove
      else (parent.removeChild(ai), off--, i++)
    }

    else if (bi) {
      if (bi.nextSibling != before || !bi.nextSibling) {
        // move (skip since will be handled by the following b)
        if (bidx.has(ai)) off--

        // insert
        parent.insertBefore(bi, before), off++
      }
    }

    before = bi
  }

  return b
}

