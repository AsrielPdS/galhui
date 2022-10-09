import { Dic, float, int, isS, l, str } from "galho/util.js";
export const uuid = (length: int = 32) => Array
  .from({ length })
  .map(() => Math.round(Math.random() * 15).toString(16))
  .join('');

export function anim(fn: () => void | boolean) {
  let t = requestAnimationFrame, t2 = () => fn() !== false && (i = t(t2)), i = t(t2);
  return () => cancelAnimationFrame(i);
}
export const up = (v: str) => v && (v[0].toUpperCase() + v.slice(1).replace(/_/g, ' '));


export const enum TimeUnit {
  /**miliseconds */
  z = 1,
  s = 1000,
  m = s * 60,
  h = m * 60,
  d = h * 24,
  w = d * 7,
  y = d * 365.24,//2
  /**quinzena */
  f = y / 24,
  /**month */
  M = y / 12,
  M2 = y / 6,
  M3 = y / 4,
  M4 = y / 3,
  M6 = y / 2,
}
export class TimeSpan {
  value: float;
  constructor()
  constructor(value: float, unit: TimeUnit)
  constructor(value?: float, unit?: TimeUnit) {
    this.value = value * unit || 0;
  }
  addDay() { }
  addYear(v = 1) {
    this.value += v * TimeUnit.y;
    return this;
  }
  addMonth(v = 1) {
    this.value += v * TimeUnit.M;
    return this;
  }
  addWeek(v = 1) {
    this.value += v * TimeUnit.w;
    return this;
  }
  to(unit: TimeUnit) { return Math.floor(this.value / unit); }
  get(ref: Date | int) {
    return new Date(<int>ref + this.value);

  }
  toString() {

    return ``
  }
}
export const timeDif = (start: Date, end: Date) => new TimeSpan(<any>end - <any>start, TimeUnit.z)
// export function day(d: Date): number;
// export function day(d: Date, value: number): Date;
// export function day(d: Date, value?: number) {
//   if (value == null) return d.getDate();
//   d.setDate(value); return d;
// }
// export type FormatValue = Date | number | string;
// export type ValueType = 'd' | 'n';

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