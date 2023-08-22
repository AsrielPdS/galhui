/**request animation frame each frame, if fn returns false cancel animation
 * @returns function that cancel the renderer of current animation
 */
export function anim(fn) {
    let r;
    console.log("timer started: " + (r = UUID(8)));
    console.time(r);
    let t = requestAnimationFrame;
    let t2 = () => {
        if (fn() !== false)
            i = t(t2);
        else
            console.timeEnd(r);
    };
    let i = t(t2);
    return () => {
        console.timeEnd(r);
        cancelAnimationFrame(i);
    };
}
export const up = (v) => v && (v[0].toUpperCase() + v.slice(1).replace(/_/g, ' '));
export function arrayToDic(arr, callback) {
    let result = {};
    for (let i = 0; i < arr.length; i++) {
        let value = arr[i];
        let temp = callback(value, i);
        result[temp[0]] = temp[1];
    }
    return result;
}
export function anyProp(dic, fn) {
    for (let key in dic)
        if (fn(dic[key], key))
            return true;
    return false;
}
export const UUID = (l) => Math.floor(Math.random() * Math.pow(10, l)).toString(16);
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
