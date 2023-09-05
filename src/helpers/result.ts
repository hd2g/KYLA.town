export type Result<E extends Error, A = unknown> =
  | { success: true; data: A }
  | { success: false; error: E }

export const tryWith = <E extends Error, A = unknown>(
  proc: () => A,
): Result<E, A> => {
  try {
    return { success: true, data: proc() }
  } catch (error) {
    return { success: false, error }
  }
}
