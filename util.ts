
export type int = number;
export type float = number;
export type str = string;
export type bool = boolean;
export type Key = str | number;
export type Primitive = str | number | bool;
export type unk = unknown;
export type Task<T> = T | Promise<T>;

export interface Dic<T = any> {
  [key: string]: T;
}
/**is number */
export const isN = (value: unk): value is number => typeof value == "number";
/**is string */
export const isS = (value: unk): value is string => typeof value == "string";
/**is function */
export const isF = <T extends Function = Function>(value: unk): value is T => typeof value === 'function';
/** is undefined */
export const isU = (value: unknown): value is undefined => typeof value == "undefined";
/**return def if value is undefined */
export const def = <T>(value: T, def: T): T => isU(value) ? def : value;