import type { Dic, Key, bool, int, str } from "galho/util.js";
import { is, isU } from "galho/util.js";

/**
 * Requests an animation frame for each frame. If `fn` returns false, cancels the animation.
 * @param fn The callback to invoke on each animation frame.
 * @returns A function that cancels the current animation.
 */
export function anim(fn: () => any) {
  let r: str;
  console.log("timer started: " + (r = UUID(8)));
  console.time(r);
  let t = requestAnimationFrame;
  let t2 = () => {
    if (fn() !== false)
      i = t(t2);
    else console.timeEnd(r);
  };
  let i = t(t2);
  return () => {
    console.timeEnd(r);
    cancelAnimationFrame(i);
  };
}

/**
 * Converts an array to a dictionary object mapping custom keys to values based on a callback.
 * @param arr The source array.
 * @param callback A function returning a tuple of key and value for each array item.
 */
export function arrayToDic<T, U>(arr: Array<T>, callback: (value: T, index: number) => [Key, U]): Dic<U> {
  let result = {};
  for (let i = 0; i < arr.length; i++) {
    let value = arr[i];
    let temp = callback(value, i);
    result[temp[0]] = temp[1];
  }
  return result;
}

/**
 * Filters and maps a dictionary.
 * @param dic The dictionary to filter/map.
 * @param fn A predicate/mapper callback function. Defaults to returning the value itself.
 */
export function filterDic<T>(dic: Dic<T>, fn?: (value: T, key: string) => any): Dic<T>;
export function filterDic<T extends Dic>(dic: T, fn?: (value: any, key: any) => any): T;
export function filterDic(dic: Dic, fn: (value, key) => any = v => v) {
  let result = {};
  for (let key in dic)
    if (fn(dic[key], key))
      result[key] = dic[key];
  return result;
}

/**
 * Checks if any property in the dictionary satisfies the predicate function.
 * @param dic The dictionary to check.
 * @param fn The predicate function.
 */
export function anyProp<T = any>(dic: Dic<T>, fn?: (value: T, key: string) => unknown) {
  for (let key in dic)
    if (fn(dic[key], key))
      return true;
  return false;
}

/**
 * Extends an object with properties from another object.
 * @param obj The target object to extend.
 * @param extension The source object providing extension properties.
 * @param override If true, overrides existing properties on the target.
 */
export function extend<T extends object, U = Partial<T>>(obj: T, extension: U, override?: bool) {
  for (let key in extension) {
    let e = extension[key];
    isU(e) || ((override || isU(obj[key as any])) && (obj[key as any] = e));
  }
  return obj as T & U;
}

/**
 * Generates a pseudo-random unique identifier string of the specified size.
 * @param size The character length of the generated UUID.
 */
export function UUID(size: int) {
  let r = Math.floor((Math.random() + 1) * 1_000_000_000_000_000).toString(16), s = r.length - 1;
  return r.slice(1, size + 1) + (size > s ? UUID(size - s) : '');
}

/**
 * Helper class wrapper around native Date for convenient date component queries.
 */
export class Time {
  constructor(public i: Date) { }
  /** Full Year component */
  get y() { return this.i.getFullYear(); }
  /** 1-based Month component */
  get M() { return this.i.getMonth() + 1; }
  /** Day of the month component */
  get d() { return this.i.getDate(); }
  /** Hours component */
  get h() { return this.i.getHours(); }
  /** Minutes component */
  get m() { return this.i.getMinutes(); }
  /** Seconds component */
  get s() { return this.i.getSeconds(); }
}

/**
 * Returns a wrapper Time object for the given Date, string or timestamp.
 * @param d The date value to wrap. Defaults to new Date().
 */
export function time(d: Date | int | str = new Date()) {
  return d ? new Time(is(d, Date) ? d : new Date(d)) : null;
}

/**
 * Pads the string representation of a value to a certain length.
 * @param v The value to pad.
 * @param max The target length.
 * @param fill The character to pad with. Defaults to '0'.
 */
export function pad(v: Key, max?: int, fill: Key = 0) {
  return (v + "").padStart(max, fill as str);
}

/**
 * Formats a Date/time representation into a standard YYYY-MM-DD date string.
 * @param t The date value.
 */
export function date(t?: Date | int | str) {
  let { y, M, d } = time(t);
  return `${y}-${pad(M, 2)}-${pad(d, 2)}`;
}

/**
 * Formats a Date/time representation into a date-time string.
 * @param t The date value.
 * @param sep The separator between date and time. Defaults to " ".
 * @param noSec If true, hides the seconds component.
 */
export function dateTime(t?: Date | int | str, sep = " ", noSec?: bool) {
  let { y, M, d, h, m, s } = time(t);
  return `${y}-${pad(M, 2)}-${pad(d, 2)}${sep}${pad(h, 2)}:${pad(m, 2)}${noSec ? '' : ':' + pad(s, 2)}`;
}

/**
 * Formats a Date/time representation into a standard YYYY-MM month string.
 * @param t The date value.
 */
export function month(t?: Date | int | str) {
  if (t == null) return null;
  let { y, M } = time(t);
  return `${y}-${pad(M, 2)}`;
}