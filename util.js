export const uuid = (length = 32) => Array
    .from({ length })
    .map(() => Math.round(Math.random() * 15).toString(16))
    .join('');
/**request animation frame each frame, if fn returns false cancel animation
 * @returns function that cancel the renderer of current animation
 */
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsTUFBTSxDQUFDLE1BQU0sSUFBSSxHQUFHLENBQUMsU0FBYyxFQUFFLEVBQUUsRUFBRSxDQUFDLEtBQUs7S0FDNUMsSUFBSSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUM7S0FDaEIsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztLQUN0RCxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDWjs7R0FFRztBQUNILE1BQU0sVUFBVSxJQUFJLENBQUMsRUFBd0I7SUFDM0MsSUFBSSxDQUFDLEdBQUcscUJBQXFCLEVBQUUsRUFBRSxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxLQUFLLEtBQUssSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ25GLE9BQU8sR0FBRyxFQUFFLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdkMsQ0FBQztBQUNELE1BQU0sQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQU0sRUFBRSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBcUJ4RixNQUFNLE9BQU8sUUFBUTtJQUNuQixLQUFLLENBQVE7SUFHYixZQUFZLEtBQWEsRUFBRSxJQUFlO1FBQ3hDLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxHQUFHLElBQUksSUFBSSxDQUFDLENBQUM7SUFDakMsQ0FBQztJQUNELE1BQU0sS0FBSyxDQUFDO0lBQ1osT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDO1FBQ1gsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLHNCQUFhLENBQUM7UUFDN0IsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBQ0QsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDO1FBQ1osSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLHFCQUFhLENBQUM7UUFDN0IsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBQ0QsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDO1FBQ1gsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLG9CQUFhLENBQUM7UUFDN0IsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBQ0QsRUFBRSxDQUFDLElBQWMsSUFBSSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUQsR0FBRyxLQUFLLE9BQU8sSUFBSSxDQUFDLEVBQUUsa0JBQVksQ0FBQyxDQUFDLENBQUM7SUFDckMsR0FBRyxDQUFDLEdBQWU7UUFDakIsT0FBTyxJQUFJLElBQUksQ0FBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRXpDLENBQUM7SUFDRCxRQUFRO1FBRU4sT0FBTyxFQUFFLENBQUE7SUFDWCxDQUFDO0NBQ0Y7QUFDRCxNQUFNLENBQUMsTUFBTSxPQUFPLEdBQUcsQ0FBQyxLQUFXLEVBQUUsR0FBUyxFQUFFLEVBQUUsQ0FBQyxJQUFJLFFBQVEsQ0FBTSxHQUFHLEdBQVEsS0FBSyxZQUFhLENBQUE7QUFDbEcsd0NBQXdDO0FBQ3hDLHFEQUFxRDtBQUNyRCxpREFBaUQ7QUFDakQsMkNBQTJDO0FBQzNDLGdDQUFnQztBQUNoQyxJQUFJO0FBQ0osb0RBQW9EO0FBQ3BELHFDQUFxQztBQUVyQyxnRkFBZ0Y7QUFDaEYsbUZBQW1GO0FBQ25GLHdFQUF3RTtBQUN4RSxrQkFBa0I7QUFDbEIsdUJBQXVCO0FBQ3ZCLHFCQUFxQjtBQUNyQixNQUFNO0FBQ04sOEJBQThCO0FBRTlCLG9DQUFvQztBQUNwQyxrQkFBa0I7QUFDbEIsZ0JBQWdCO0FBQ2hCLG1DQUFtQztBQUNuQyxnQkFBZ0I7QUFFaEIsTUFBTTtBQUNOLHdDQUF3QztBQUV4QyxvQ0FBb0M7QUFDcEMsb0JBQW9CO0FBRXBCLFlBQVk7QUFDWiw0Q0FBNEM7QUFDNUMsMEJBQTBCO0FBQzFCLHVCQUF1QjtBQUN2Qix1QkFBdUI7QUFDdkIsc0JBQXNCO0FBQ3RCLGlCQUFpQjtBQUNqQix1QkFBdUI7QUFDdkIsNkJBQTZCO0FBQzdCLHdCQUF3QjtBQUN4QiwwQkFBMEI7QUFDMUIsd0JBQXdCO0FBQ3hCLDJCQUEyQjtBQUMzQixpQkFBaUI7QUFDakIsdUJBQXVCO0FBQ3ZCLHNCQUFzQjtBQUN0QixpQkFBaUI7QUFDakIsd0JBQXdCO0FBQ3hCLHNCQUFzQjtBQUN0QixpQkFBaUI7QUFDakIsaUJBQWlCO0FBQ2pCLHNCQUFzQjtBQUN0QixRQUFRO0FBQ1IsTUFBTTtBQUNOLHdCQUF3QjtBQUN4QixhQUFhO0FBQ2IsZ0JBQWdCO0FBQ2hCLHlDQUF5QztBQUN6QyxlQUFlO0FBQ2YsZ0JBQWdCO0FBQ2hCLDZDQUE2QztBQUM3QyxlQUFlO0FBQ2YsTUFBTTtBQUNOLElBQUkifQ==