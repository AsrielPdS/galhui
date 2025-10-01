import { Dic, Key, bool, int, is, isU, str } from "galho/util.js";

/**request animation frame each frame, if fn returns false cancel animation
 * @returns function that cancel the renderer of current animation
 */
export function anim(fn: () => any) {
  let r: str;
  console.log("timer started: " + (r = UUID(8)))
  console.time(r);
  let t = requestAnimationFrame;
  let t2 = () => {
    if (fn() !== false)
      i = t(t2)
    else console.timeEnd(r);
  };
  let i = t(t2);
  return () => {
    console.timeEnd(r);
    cancelAnimationFrame(i);
  }
}
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
 * map dictionary
 * @param dic
 * @param fn
 */
export function filterDic<T>(dic: Dic<T>, fn?: (value: T, key: string) => any): Dic<T>
export function filterDic<T extends Dic>(dic: T, fn?: (value: any, key: any) => any): T
export function filterDic(dic: Dic, fn: (value, key) => any = v => v) {
  let result = {};
  for (let key in dic)
    if (fn(dic[key], key))
      result[key] = dic[key];
  return result;
}
export function anyProp<T = any>(dic: Dic<T>, fn?: (value: T, key: string) => unknown) {
  for (let key in dic)
    if (fn(dic[key], key))
      return true;
  return false;
}

export function extend<T extends object, U = Partial<T>>(obj: T, extension: U, override?: bool) {
  for (let key in extension) {
    let e = extension[key];
    isU(e) || ((override || isU(obj[key as any])) && (obj[key as any] = e));
  }
  return obj as T & U;
}
export function UUID(size: int) {
  let r = Math.floor((Math.random() + 1) * 1_000_000_000_000_000).toString(16), s = r.length - 1;
  return r.slice(1, size + 1) + (size > s ? UUID(size - s) : '');
}

export class Time {
  constructor(public i: Date) { }
  get y() { return this.i.getFullYear(); }
  get M() { return this.i.getMonth() + 1; }
  get d() { return this.i.getDate(); }
  get h() { return this.i.getHours(); }
  get m() { return this.i.getMinutes(); }
  get s() { return this.i.getSeconds(); }
  // get w() {
  //   let { y, M, d } = this;
  //   let onejan = new Date(y, 0, 1);
  //   let today = new Date(y, M, d);
  //   let dayOfYear = ((today - onejan + 86400000) / 86400000);
  //   return Math.ceil(dayOfYear / 7)
  // }
}
export function time(d: Date | int | str = new Date()) {
  return d ? new Time(is(d, Date) ? d : new Date(d)) : null;
}
export function pad(v: Key, max?: int, fill: Key = 0) {
  return (v + "").padStart(max, fill as str)
}
export function date(t?: Date | int | str) {
  let { y, M, d } = time(t);
  return `${y}-${pad(M, 2)}-${pad(d, 2)}`;
}
export function dateTime(t?: Date | int | str, sep = " ", noSec?: bool) {
  let { y, M, d, h, m, s } = time(t);
  return `${y}-${pad(M, 2)}-${pad(d, 2)}${sep}${pad(h, 2)}:${pad(m, 2)}${noSec ? '' : ':' + pad(s, 2)}`;
}
export function month(t?: Date | int | str) {
  if (t == null) return null;
  let { y, M } = time(t);
  return `${y}-${pad(M, 2)}`;
  // return new Date(v).toISOString().slice(0, 10);
}

// export function day(d: Date): number;
// export function day(d: Date, value: number): Date;
// export function day(d: Date, value?: number) {
//   if (value == null) return d.getDate();

// export function fmt(value: FormatValue, pattern: string, options?: Dic): str;
// export function fmt(value: FormatValue, pattern: string, type?: ValueType): str;
// export function fmt(v: FormatValue, p: string, o?: ValueType | Dic) {
//   if (isS(o)) {
//     p = o + ";" + p;
//     o = <Dic>null;
//   }
//   if (v == null) return "";

//   let [a0, a1] = p.split(';', 3);
//   switch (a0) {
//     case "d":
//       return Intl.NumberFormat()
//     case "n":

//   }
//   p = l(split) > 1 ? split[1] : type;

//   if (v == null && l(split) == 3)
//     v = split[2];

//   //a:Any
//   if (split.length == 1 || type == 'a') {
//     switch (typeof v) {
//       case 'number':
//       case 'bigint':
//         type = 'n';
//         break;
//       case 'string':
//         if (isNaN(<any>v))
//           type = 'n';
//         else if (false)
//           type = 'd';
//         else type = 't';
//         break;
//       case 'object':
//         type = 'd';
//         break;
//       case 'boolean':
//         type = 'b';
//         break;
//       default:
//         type = 't';
//     }
//   }
//   switch (split[0]) {
//     //date
//     case 'd':
//       return fmtTime(time(v), format);
//     //number
//     case 'n':
//       return numFmt(<number>v, format, o);
//     default:
//   }
// }