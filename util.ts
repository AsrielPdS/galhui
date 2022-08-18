import { Dic } from "./dic";

export type int = number;
export type float = number;
export type str = string;
export type bool = boolean;
export type Key = str | number;
export type Primitive = str | number | bool;
export type unk = unknown;
export type Task<T> = T | Promise<T>;

/**is number */
export const isN = (value: unk): value is number => typeof value == "number";
/**is string */
export const isS = (value: unk): value is string => typeof value == "string";
/**is function */
export const isF = <T extends Function = Function>(value: unk): value is T => typeof value === 'function';
/** is object */
export const isO = (value: unk): value is Dic => typeof value == "object";
/** is boolean */
export const isB = (value: unk): value is boolean => typeof value == "boolean";
/** is undefined */
export const isU = (value: unk): value is undefined => typeof value == "undefined";
/**toString, obs null and undefined return an empty string */
export const toStr = (v: unk) => v == null ? v + "" : "";
/** is promise like */
export const isP = (value: any): value is PromiseLike<any> => value && isF(value.then)
/**return def if value is undefined */
export const def = <T>(value: T, def: T): T => isU(value) ? def : value;
/**is not false t=true*/
export const t = (value: unknown): bool => value !== false;
export function call<T>(v: T, cb: (v: T) => any): T {
  cb(v);
  return v;
}
export function delay(index: number, cb: Function, time?: float): number {
  clearTimeout(index);
  return setTimeout(cb, time);
}
export const uuid = (length: int = 32) => Array
  .from({ length })
  .map(() => Math.round(Math.random() * 15).toString(16))
  .join('');
export function ex<T>(target: T, extension: Partial<T>): T;
export function ex<T>(target: T, source: Partial<T>): T;
export function ex<T, U, V>(target: T, source1: U, source2: V): T & U & V;
export function ex<T, U, V, W>(target: T, source1: U, source2: V, source3: W): T & U & V & W;
export function ex(target: object, s1: any, s2: any, s3: any, ...sources: any[]): any;
export function ex(target: any, ...v: any[]) {
  return Object.assign(target, ...v);
}