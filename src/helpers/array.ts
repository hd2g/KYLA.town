// @ts-ignore: TOOD: define types later...
const complement = (pred) => (...args) => !pred(...args)

export const take = <A = unknown>(xs: A[], pos: number): A[] => xs.slice(0, pos)
export const drop = <A = unknown>(xs: A[], pos: number): A[] => xs.slice(pos)

export const takeWhile = <A = unknown>(
  xs: A[],
  pred: (x: A, index: number, self: A[]) => boolean,
): A[] => {
  const pos = xs.findIndex(complement(pred))

  if (pos < 0) return []
  else return take(xs, pos - 1)
}

export const dropWhile = <A = unknown>(
  xs: A[],
  pred: (x: A, index: number, self: A[]) => boolean,
): A[] => {
  const pos = xs.findIndex(complement(pred))

  if (pos < 0) return []
  else return drop(xs, pos - 1)
}

export const splitAt = <A = unknown>(
  xs: A[],
  pos: number,
): A[][] => [take(xs, pos), drop(xs, pos)]
export const splitWith = <A = unknown>(
  xs: A[],
  pred: (x: A, index: number, self: A[]) => boolean,
): A[][] => [takeWhile(xs, pred), dropWhile(xs, pred)]

export const partition = <A = unknown>(xs: A[], size: number): A[][] => {
  const [ys, yss] = splitAt(xs, size)

  if (yss.length) {
    return [ys, ...partition(yss, size)]
  } else {
    return [ys]
  }
}

export const partitionWith = <A = unknown>(
  xs: A[],
  pred: (x: A, index: number, self: A[]) => boolean,
): A[][] => {
  const [ys, yss] = splitWith(xs, pred)

  if (yss.length) {
    return [ys, ...partitionWith(yss, pred)]
  } else {
    return [ys]
  }
}
