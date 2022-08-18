declare global {
  type Arr<T> = T[] | T;
}
/**get last item of array */
export const z = <T>(a: ArrayLike<T>) => a[l(a) - 1];
export const filter = <T>(arr: Array<T>, filter?: (v: T, i: number) => boolean) =>
  arr.filter(filter || (v => v));

/**get length of array */
export const l = (a: ArrayLike<any>) => a.length;

/** is array */
export const isA = <T>(value: unknown): value is T[] => Array.isArray(value);

export function byKey<T, K extends keyof T>(arr: ArrayLike<T>, name: T[K], key: K = "key" as any): T {
  for (let i = 0; i < arr.length; i++)
    if (name === arr[i][key])
      return arr[i];
  return null;
}
export const valid = <T>(arr: Array<T>): T[] => arr.filter(v => v != null);
export const sub = <T, K extends keyof T>(arr: Array<T>, key: K): T[K][] => arr.map(v => v?.[key])