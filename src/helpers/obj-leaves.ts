type ObjectLeaves = (obj: unknown, acc?: string[]) => string[]

function isObject(val: unknown): val is Record<string, unknown> {
  return val != null && typeof val === 'object' && Array.isArray(val) === false
}

const objLeaves: ObjectLeaves = (obj, acc = []) => {
  const fn = (o: unknown, s?: string) => {
    if (Array.isArray(o)) {
      return Object.keys(o).forEach((k) => {
        const path = s ? `${s}[${k}]` : k

        const isLeaf = fn(o[+k], path) === false
        if (isLeaf) {
          acc.push(path)
        }
      })
    }

    if (isObject(o)) {
      return Object.keys(o).forEach((k) => {
        const path = s ? `${s}.${k}` : k

        const isLeaf = fn(o[k], path) === false
        if (isLeaf) {
          acc.push(path)
        }
      })
    }

    return false
  }

  fn(obj)
  return acc
}

export default objLeaves
