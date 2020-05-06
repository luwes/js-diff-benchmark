module.exports = (parent, a, b, end = null) => {
  let i = 0, cur, next, bi

  // skip head
  while (a[i] === b[i] && b[i++]);

  // append
  if (i == a.length) while (bi = b[i++]) parent.insertBefore(bi, end)

  else {
    cur = a[i] || end

    while (bi = b[i++]) {
      next = cur ? cur.nextSibling : end

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
