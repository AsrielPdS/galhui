import { G } from "galho";
import { Dic, Key, bool, int, isU, str } from "galho/util.js";

/**request animation frame each frame, if fn returns false cancel animation
 * @returns function that cancel the renderer of current animation
 */
export function anim(fn: () => void | boolean) {
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
export const up = (v: str) => v && (v[0].toUpperCase() + v.slice(1).replace(/_/g, ' '));
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
export const UUID = (l?:int) => Math.floor(Math.random() * Math.pow(10, l)).toString(16);
export type Input = G<HTMLInputElement>;
export type Div = HTMLDivElement;
export type Button = HTMLButtonElement;
export type InputElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

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