module.exports = (parent, a, b, end = null) => {
  let bidx = new Set(b), aidx = new Set, i = 0, cur, next, bi
  
  while (bi = a[i++]) !bidx.has(bi) ? parent.removeChild(bi) : (aidx.add(bi), cur = cur || bi)
  cur = cur || end, i = 0

  while (bi = b[i++]) {
    next = cur.nextSibling

    // skip
    if (cur == bi) cur = next

    else {
      // swap
      if (b[i] === next && aidx.has(bi)) cur = next

      // insert
      parent.insertBefore(bi, cur)
    }
  }

  return b
}

