"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromArray = exports.filter = exports.toArray = exports.isEmpty = exports.each = exports.firstKey = exports.last = exports.first = exports.any = void 0;
function any(dic, fn) {
    for (let key in dic)
        if (fn(dic[key], key))
            return true;
    return false;
}
exports.any = any;
function first(dic, fn) {
    for (let key in dic)
        if (!fn || fn(dic[key], key))
            return dic[key];
    return void 0;
}
exports.first = first;
function last(dic, fn) {
    let v;
    for (let key in dic)
        if (!fn || fn(dic[key], key))
            v = dic[key];
    return v;
}
exports.last = last;
function firstKey(dic, fn) {
    for (let key in dic)
        if (!fn || fn(dic[key], key))
            return key;
    return void 0;
}
exports.firstKey = firstKey;
function each(dic, forEach) {
    for (let key in dic) {
        let t = forEach(dic[key], key);
        if (t === false)
            return;
    }
    return dic;
}
exports.each = each;
function isEmpty(obj) {
    for (let _k in obj)
        return false;
    return true;
}
exports.isEmpty = isEmpty;
/**
 * dictionary to Array
 * @param dic
 * @param fn
 */
function toArray(dic, fn) {
    var result = [];
    for (var key in dic)
        result.push(fn(dic[key], key));
    return result;
}
exports.toArray = toArray;
/**
 * map dictionary
 * @param dic
 * @param fn
 */
function filter(dic, fn = v => v) {
    let result = {};
    for (let key in dic)
        if (fn(dic[key], key))
            result[key] = dic[key];
    return result;
}
exports.filter = filter;
function fromArray(arr, callback) {
    let result = {};
    for (let i = 0; i < arr.length; i++) {
        let value = arr[i];
        let temp = callback(value, i);
        result[temp[0]] = temp[1];
    }
    return result;
}
exports.fromArray = fromArray;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGljLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGljLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQU1BLFNBQWdCLEdBQUcsQ0FBVSxHQUFXLEVBQUUsRUFBdUM7SUFDL0UsS0FBSyxJQUFJLEdBQUcsSUFBSSxHQUFHO1FBQ2pCLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUM7WUFDbkIsT0FBTyxJQUFJLENBQUM7SUFDaEIsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDO0FBTEQsa0JBS0M7QUFDRCxTQUFnQixLQUFLLENBQVUsR0FBVyxFQUFFLEVBQXVDO0lBQ2pGLEtBQUssSUFBSSxHQUFHLElBQUksR0FBRztRQUNqQixJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxDQUFDO1lBQzFCLE9BQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3BCLE9BQU8sS0FBSyxDQUFDLENBQUM7QUFDaEIsQ0FBQztBQUxELHNCQUtDO0FBQ0QsU0FBZ0IsSUFBSSxDQUFVLEdBQVcsRUFBRSxFQUF1QztJQUNoRixJQUFJLENBQUksQ0FBQztJQUNULEtBQUssSUFBSSxHQUFHLElBQUksR0FBRztRQUNqQixJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxDQUFDO1lBQzFCLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDakIsT0FBTyxDQUFDLENBQUM7QUFDWCxDQUFDO0FBTkQsb0JBTUM7QUFDRCxTQUFnQixRQUFRLENBQVUsR0FBVyxFQUFFLEVBQXVDO0lBQ3BGLEtBQUssSUFBSSxHQUFHLElBQUksR0FBRztRQUNqQixJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxDQUFDO1lBQzFCLE9BQU8sR0FBRyxDQUFDO0lBQ2YsT0FBTyxLQUFLLENBQUMsQ0FBQztBQUNoQixDQUFDO0FBTEQsNEJBS0M7QUFDRCxTQUFnQixJQUFJLENBQVUsR0FBVyxFQUFFLE9BQStDO0lBQ3hGLEtBQUssSUFBSSxHQUFHLElBQUksR0FBRyxFQUFFO1FBQ25CLElBQUksQ0FBQyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDL0IsSUFBSSxDQUFDLEtBQUssS0FBSztZQUNiLE9BQU87S0FDVjtJQUNELE9BQU8sR0FBRyxDQUFDO0FBQ2IsQ0FBQztBQVBELG9CQU9DO0FBQ0QsU0FBZ0IsT0FBTyxDQUFDLEdBQVE7SUFDOUIsS0FBSyxJQUFJLEVBQUUsSUFBSSxHQUFHO1FBQ2hCLE9BQU8sS0FBSyxDQUFDO0lBQ2YsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBSkQsMEJBSUM7QUFDRDs7OztHQUlHO0FBQ0gsU0FBZ0IsT0FBTyxDQUFPLEdBQVcsRUFBRSxFQUFnQztJQUN6RSxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7SUFDaEIsS0FBSyxJQUFJLEdBQUcsSUFBSSxHQUFHO1FBQ2pCLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ2pDLE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUM7QUFMRCwwQkFLQztBQUNEOzs7O0dBSUc7QUFDSCxTQUFnQixNQUFNLENBQUksR0FBVyxFQUFFLEtBQXFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNoRixJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7SUFDaEIsS0FBSyxJQUFJLEdBQUcsSUFBSSxHQUFHO1FBQ2pCLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUM7WUFDbkIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMzQixPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDO0FBTkQsd0JBTUM7QUFDRCxTQUFnQixTQUFTLENBQU8sR0FBYSxFQUFFLFFBQWtEO0lBQy9GLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztJQUNoQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNuQyxJQUFJLEtBQUssR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkIsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM5QixNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQzNCO0lBQ0QsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQztBQVJELDhCQVFDIn0=