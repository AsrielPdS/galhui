import { isU } from "galho/util.js";
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
export function filterDic(dic, fn = v => v) {
    let result = {};
    for (let key in dic)
        if (fn(dic[key], key))
            result[key] = dic[key];
    return result;
}
export function anyProp(dic, fn) {
    for (let key in dic)
        if (fn(dic[key], key))
            return true;
    return false;
}
export function extend(obj, extension, override) {
    for (let key in extension) {
        let e = extension[key];
        isU(e) || ((override || isU(obj[key])) && (obj[key] = e));
    }
    return obj;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUE4QixHQUFHLEVBQU8sTUFBTSxlQUFlLENBQUM7QUFFckU7O0dBRUc7QUFDSCxNQUFNLFVBQVUsSUFBSSxDQUFDLEVBQXdCO0lBQzNDLElBQUksQ0FBTSxDQUFDO0lBQ1gsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQzlDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDaEIsSUFBSSxDQUFDLEdBQUcscUJBQXFCLENBQUM7SUFDOUIsSUFBSSxFQUFFLEdBQUcsR0FBRyxFQUFFO1FBQ1osSUFBSSxFQUFFLEVBQUUsS0FBSyxLQUFLO1lBQ2hCLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUE7O1lBQ04sT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMxQixDQUFDLENBQUM7SUFDRixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDZCxPQUFPLEdBQUcsRUFBRTtRQUNWLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkIsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUIsQ0FBQyxDQUFBO0FBQ0gsQ0FBQztBQUNELE1BQU0sQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQU0sRUFBRSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3hGLE1BQU0sVUFBVSxVQUFVLENBQU8sR0FBYSxFQUFF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