module.exports = module.exports = (parent, a, b, end = null) => {
  let bidx = new Set(b), aidx = new Set(a), i = 0, cur = a[0], next, bi

  while ((bi = b[i++]) || cur != end) {
    next = cur ? cur.nextSibling : end

    // skip
    if (cur == bi) cur = next

    // insert has higher priority, inc. tail-append shortcut
    else if (bi && (!cur || bidx.has(cur))) {
      // swap
      if (b[i] === next && aidx.has(bi)) cur = next

      // insert
      parent.insertBefore(bi, cur)
    }

    // remove
    else (parent.removeChild(cur), cur = next, i--)
  }

  return b
}
