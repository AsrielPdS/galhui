"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeDif = exports.TimeSpan = exports.up = exports.anim = exports.uuid = void 0;
const uuid = (length = 32) => Array
    .from({ length })
    .map(() => Math.round(Math.random() * 15).toString(16))
    .join('');
exports.uuid = uuid;
function anim(fn) {
    let t = requestAnimationFrame, t2 = () => fn() !== false && (i = t(t2)), i = t(t2);
    return () => cancelAnimationFrame(i);
}
exports.anim = anim;
const up = (v) => v && (v[0].toUpperCase() + v.slice(1).replace(/_/g, ' '));
exports.up = up;
class TimeSpan {
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
    get(ref) {
        return new Date(ref + this.value);
    }
    toString() {
        return ``;
    }
}
exports.TimeSpan = TimeSpan;
const timeDif = (start, end) => new TimeSpan(end - start, 1 /* z */);
exports.timeDif = timeDif;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ08sTUFBTSxJQUFJLEdBQUcsQ0FBQyxTQUFjLEVBQUUsRUFBRSxFQUFFLENBQUMsS0FBSztLQUM1QyxJQUFJLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQztLQUNoQixHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQ3RELElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUhDLFFBQUEsSUFBSSxRQUdMO0FBRVosU0FBZ0IsSUFBSSxDQUFDLEVBQXdCO0lBQzNDLElBQUksQ0FBQyxHQUFHLHFCQUFxQixFQUFFLEVBQUUsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsS0FBSyxLQUFLLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNuRixPQUFPLEdBQUcsRUFBRSxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3ZDLENBQUM7QUFIRCxvQkFHQztBQUNNLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFBM0UsUUFBQSxFQUFFLE1BQXlFO0FBcUJ4RixNQUFhLFFBQVE7SUFJbkIsWUFBWSxLQUFhLEVBQUUsSUFBZTtRQUN4QyxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFDRCxNQUFNLEtBQUssQ0FBQztJQUNaLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQztRQUNYLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxzQkFBYSxDQUFDO1FBQzdCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUNELFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQztRQUNaLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxxQkFBYSxDQUFDO1FBQzdCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUNELE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQztRQUNYLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxvQkFBYSxDQUFDO1FBQzdCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUNELEVBQUUsQ0FBQyxJQUFjLElBQUksT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVELEdBQUcsQ0FBQyxHQUFlO1FBQ2pCLE9BQU8sSUFBSSxJQUFJLENBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUV6QyxDQUFDO0lBQ0QsUUFBUTtRQUVOLE9BQU8sRUFBRSxDQUFBO0lBQ1gsQ0FBQztDQUNGO0FBN0JELDRCQTZCQztBQUNNLE1BQU0sT0FBTyxHQUFHLENBQUMsS0FBVyxFQUFFLEdBQVMsRUFBRSxFQUFFLENBQUMsSUFBSSxRQUFRLENBQU0sR0FBRyxHQUFRLEtBQUssWUFBYSxDQUFBO0FBQXJGLFFBQUEsT0FBTyxXQUE4RTtBQUNsRyx3Q0FBd0M7QUFDeEMscURBQXFEO0FBQ3JELGlEQUFpRDtBQUNqRCwyQ0FBMkM7QUFDM0MsZ0NBQWdDO0FBQ2hDLElBQUk7QUFDSixvREFBb0Q7QUFDcEQscUNBQXFDO0FBRXJDLGdGQUFnRjtBQUNoRixtRkFBbUY7QUFDbkYsd0VBQXdFO0FBQ3hFLGtCQUFrQjtBQUNsQix1QkFBdUI7QUFDdkIscUJBQXFCO0FBQ3JCLE1BQU07QUFDTiw4QkFBOEI7QUFFOUIsb0NBQW9DO0FBQ3BDLGtCQUFrQjtBQUNsQixnQkFBZ0I7QUFDaEIsbUNBQW1DO0FBQ25DLGdCQUFnQjtBQUVoQixNQUFNO0FBQ04sd0NBQXdDO0FBRXhDLG9DQUFvQztBQUNwQyxvQkFBb0I7QUFFcEIsWUFBWTtBQUNaLDRDQUE0QztBQUM1QywwQkFBMEI7QUFDMUIsdUJBQXVCO0FBQ3ZCLHVCQUF1QjtBQUN2QixzQkFBc0I7QUFDdEIsaUJBQWlCO0FBQ2pCLHVCQUF1QjtBQUN2Qiw2QkFBNkI7QUFDN0Isd0JBQXdCO0FBQ3hCLDBCQUEwQjtBQUMxQix3QkFBd0I7QUFDeEIsMkJBQTJCO0FBQzNCLGlCQUFpQjtBQUNqQix1QkFBdUI7QUFDdkIsc0JBQXNCO0FBQ3RCLGlCQUFpQjtBQUNqQix3QkFBd0I7QUFDeEIsc0JBQXNCO0FBQ3RCLGlCQUFpQjtBQUNqQixpQkFBaUI7QUFDakIsc0JBQXNCO0FBQ3RCLFFBQVE7QUFDUixNQUFNO0FBQ04sd0JBQXdCO0FBQ3hCLGFBQWE7QUFDYixnQkFBZ0I7QUFDaEIseUNBQXlDO0FBQ3pDLGVBQWU7QUFDZixnQkFBZ0I7QUFDaEIsNkNBQTZDO0FBQzdDLGVBQWU7QUFDZixNQUFNO0FBQ04sSUFBSSJ9