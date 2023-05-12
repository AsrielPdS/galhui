export const uuid = (length = 32) => Array
    .from({ length })
    .map(() => Math.round(Math.random() * 15).toString(16))
    .join('');
/**request animation frame each frame, if fn returns false cancel animation
 * @returns function that cancel the renderer of current animation
 */
export function anim(fn) {
    let r;
    console.log("timer started: " + (r = uuid(4)));
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
export class TimeSpan {
    value;
    constructor(value, unit) {
        this.value = value * unit || 0;
    }
    addDay() { }
    addYear(v = 1) {
        this.value += v * 31556736000 /* TimeUnit.y */;
        return this;
    }
    addMonth(v = 1) {
        this.value += v * 2629728000 /* TimeUnit.M */;
        return this;
    }
    addWeek(v = 1) {
        this.value += v * 604800000 /* TimeUnit.w */;
        return this;
    }
    to(unit) { return Math.floor(this.value / unit); }
    day() { return this.to(86400000 /* TimeUnit.d */); }
    get(ref) {
        return new Date(ref + this.value);
    }
    toString() {
        return ``;
    }
}
export const timeDif = (start, end) => new TimeSpan(end - start, 1 /* TimeUnit.z */);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsTUFBTSxDQUFDLE1BQU0sSUFBSSxHQUFHLENBQUMsU0FBYyxFQUFFLEVBQUUsRUFBRSxDQUFDLEtBQUs7S0FDNUMsSUFBSSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUM7S0FDaEIsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztLQUN0RCxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDWjs7R0FFRztBQUNILE1BQU0sVUFBVSxJQUFJLENBQUMsRUFBd0I7SUFDM0MsSUFBSSxDQUFDLENBQUM7SUFDTixPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDOUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNoQixJQUFJLENBQUMsR0FBRyxxQkFBcUIsQ0FBQztJQUM5QixJQUFJLEVBQUUsR0FBRyxHQUFHLEVBQUU7UUFDWixJQUFJLEVBQUUsRUFBRSxLQUFLLEtBQUs7WUFDaEIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQTs7WUFDTixPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFCLENBQUMsQ0FBQztJQUNGLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNkLE9BQU8sR0FBRyxFQUFFO1FBQ1YsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuQixvQkFBb0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMxQixDQUFDLENBQUE7QUFDSCxDQUFDO0FBQ0QsTUFBTSxDQUFD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