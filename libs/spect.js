module.exports = (parent, a, b, end = null) => {
  let i = 0, cur, next, bi

  // skip head
  if (a.length) while (a[i] === b[i]) i++

  // append
  if (i >= a.length) while (i < b.length) parent.insertBefore(b[i++], end)

  else {
    cur = a[i] || end

    while (i < b.length) {
      bi = b[i++], next = cur ? cur.nextSibling : end

      // skip
      if (cur == bi) cur = next

      // swap / replace
      else if (b[i] === next) (parent.replaceChild(bi, cur), cur = next)

      // insert
      else parent.insertBefore(bi, cur)
    }

    // remove tail
    while (cur !== end) (next = cur ? cur.nextSibling : end, parent.removeChild(cur), cur = next)
  }

  return b
}
