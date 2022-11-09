export const uuid = (length = 32) => Array
    .from({ length })
    .map(() => Math.round(Math.random() * 15).toString(16))
    .join('');
export function anim(fn) {
    let t = requestAnimationFrame, t2 = () => fn() !== false && (i = t(t2)), i = t(t2);
    return () => cancelAnimationFrame(i);
}
export const up = (v) => v && (v[0].toUpperCase() + v.slice(1).replace(/_/g, ' '));
export class TimeSpan {
    value;
    constructor(value, unit) {
        this.value = value * unit || 0;
    }
    addDay() { }
    addYear(v = 1) {
        this.value += v * 31556736000 /* y */;
        return this;
    }
    addMonth(v = 1) {
        this.value += v * 2629728000 /* M */;
        return this;
    }
    addWeek(v = 1) {
        this.value += v * 604800000 /* w */;
        return this;
    }
    to(unit) { return Math.floor(this.value / unit); }
    day() { return this.to(86400000 /* d */); }
    get(ref) {
        return new Date(ref + this.value);
    }
    toString() {
        return ``;
    }
}
export const timeDif = (start, end) => new TimeSpan(end - start, 1 /* z */);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsTUFBTSxDQUFDLE1BQU0sSUFBSSxHQUFHLENBQUMsU0FBYyxFQUFFLEVBQUUsRUFBRSxDQUFDLEtBQUs7S0FDNUMsSUFBSSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUM7S0FDaEIsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztLQUN0RCxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7QUFFWixNQUFNLFVBQVUsSUFBSSxDQUFDLEVBQXdCO0lBQzNDLElBQUksQ0FBQyxHQUFHLHFCQUFxQixFQUFFLEVBQUUsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsS0FBSyxLQUFLLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNuRixPQUFPLEdBQUcsRUFBRSxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3ZDLENBQUM7QUFDRCxNQUFNLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFNLEVBQUUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztBQXFCeEYsTUFBTSxPQUFPLFFBQVE7SUFDbkIsS0FBSyxDQUFRO0lBR2IsWUFBWSxLQUFhLEVBQUUsSUFBZTtRQUN4QyxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFDRCxNQUFNLEtBQUssQ0FBQztJQUNaLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQztRQUNYLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxzQkFBYSxDQUFDO1FBQzdCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUNELFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQztRQUNaLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxxQkFBYSxDQUFDO1FBQzdCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUNELE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQztRQUNYLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxvQkFBYSxDQUFDO1FBQzdCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUNELEVBQUUsQ0FBQyxJQUFjLElBQUksT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVELEdBQUcsS0FBSyxPQUFPLElBQUksQ0FBQyxFQUFFLGtCQUFZLENBQUMsQ0FBQyxDQUFDO0lBQ3JDLEdBQUcsQ0FBQyxHQUFlO1FBQ2pCLE9BQU8sSUFBSSxJQUFJLENBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUV6QyxDQUFDO0lBQ0QsUUFBUTtRQUVOLE9BQU8sRUFBRSxDQUFBO0lBQ1gsQ0FBQztDQUNGO0FBQ0QsTUFBTSxDQUFDLE1BQU0sT0FBTyxHQUFHLENBQUMsS0FBVyxFQUFFLEdBQVMsRUFBRSxFQUFFLENBQUMsSUFBSSxRQUFRLENBQU0sR0FBRyxHQUFRLEtBQUssWUFBYSxDQUFBO0FBQ2xHLHdDQUF3QztBQUN4QyxxREFBcUQ7QUFDckQsaURBQWlEO0FBQ2pELDJDQUEyQztBQUMzQyxnQ0FBZ0M7QUFDaEMsSUFBSTtBQUNKLG9EQUFvRDtBQUNwRCxxQ0FBcUM7QUFFckMsZ0ZBQWdGO0FBQ2hGLG1GQUFtRjtBQUNuRix3RUFBd0U7QUFDeEUsa0JBQWtCO0FBQ2xCLHVCQUF1QjtBQUN2QixxQkFBcUI7QUFDckIsTUFBTTtBQUNOLDhCQUE4QjtBQUU5QixvQ0FBb0M7QUFDcEMsa0JBQWtCO0FBQ2xCLGdCQUFnQjtBQUNoQixtQ0FBbUM7QUFDbkMsZ0JBQWdCO0FBRWhCLE1BQU07QUFDTix3Q0FBd0M7QUFFeEMsb0NBQW9DO0FBQ3BDLG9CQUFvQjtBQUVwQixZQUFZO0FBQ1osNENBQTRDO0FBQzVDLDBCQUEwQjtBQUMxQix1QkFBdUI7QUFDdkIsdUJBQXVCO0FBQ3ZCLHNCQUFzQjtBQUN0QixpQkFBaUI7QUFDakIsdUJBQXVCO0FBQ3ZCLDZCQUE2QjtBQUM3Qix3QkFBd0I7QUFDeEIsMEJBQTBCO0FBQzFCLHdCQUF3QjtBQUN4QiwyQkFBMkI7QUFDM0IsaUJBQWlCO0FBQ2pCLHVCQUF1QjtBQUN2QixzQkFBc0I7QUFDdEIsaUJBQWlCO0FBQ2pCLHdCQUF3QjtBQUN4QixzQkFBc0I7QUFDdEIsaUJBQWlCO0FBQ2pCLGlCQUFpQjtBQUNqQixzQkFBc0I7QUFDdEIsUUFBUTtBQUNSLE1BQU07QUFDTix3QkFBd0I7QUFDeEIsYUFBYTtBQUNiLGdCQUFnQjtBQUNoQix5Q0FBeUM7QUFDekMsZUFBZTtBQUNmLGdCQUFnQjtBQUNoQiw2Q0FBNkM7QUFDN0MsZUFBZTtBQUNmLE1BQU07QUFDTixJQUFJIn0=