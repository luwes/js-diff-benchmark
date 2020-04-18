module.exports = function merge (parent, a, b) {
  const bidx = new Set(b), aidx = new Set(a)
  let i, cur = a[0], next, bi

  for (i = 0; i <= b.length; i++) {
    bi = b[i]
    next = cur && cur.nextSibling

    // skip
    if (cur === bi) cur = next

    // remove
    else if (cur && !bidx.has(cur)) {
      parent.removeChild(cur), i--, cur = next
    }
    else if (bi) {
      // swap (only 1:1 pairs)
      if (aidx.has(bi) && b[i+1] === next) {
        parent.insertBefore(cur, bi), cur = next
      }

      // insert after bi-1, bi
      parent.insertBefore(bi, cur)
    }
  }

  return b
}
