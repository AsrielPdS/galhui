"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.def = exports.isU = exports.isF = exports.isS = exports.isN = void 0;
/**is number */
const isN = (value) => typeof value == "number";
exports.isN = isN;
/**is string */
const isS = (value) => typeof value == "string";
exports.isS = isS;
/**is function */
const isF = (value) => typeof value === 'function';
exports.isF = isF;
/** is undefined */
const isU = (value) => typeof value == "undefined";
exports.isU = isU;
/**return def if value is undefined */
const def = (value, def) => (0, exports.isU)(value) ? def : value;
exports.def = def;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBYUEsZUFBZTtBQUNSLE1BQU0sR0FBRyxHQUFHLENBQUMsS0FBVSxFQUFtQixFQUFFLENBQUMsT0FBTyxLQUFLLElBQUksUUFBUSxDQUFDO0FBQWhFLFFBQUEsR0FBRyxPQUE2RDtBQUM3RSxlQUFlO0FBQ1IsTUFBTSxHQUFHLEdBQUcsQ0FBQyxLQUFVLEVBQW1CLEVBQUUsQ0FBQyxPQUFPLEtBQUssSUFBSSxRQUFRLENBQUM7QUFBaEUsUUFBQSxHQUFHLE9BQTZEO0FBQzdFLGlCQUFpQjtBQUNWLE1BQU0sR0FBRyxHQUFHLENBQWdDLEtBQVUsRUFBYyxFQUFFLENBQUMsT0FBTyxLQUFLLEtBQUssVUFBVSxDQUFDO0FBQTdGLFFBQUEsR0FBRyxPQUEwRjtBQUMxRyxtQkFBbUI7QUFDWixNQUFNLEdBQUcsR0FBRyxDQUFDLEtBQWMsRUFBc0IsRUFBRSxDQUFDLE9BQU8sS0FBSyxJQUFJLFdBQVcsQ0FBQztBQUExRSxRQUFBLEdBQUcsT0FBdUU7QUFDdkYsc0NBQXNDO0FBQy9CLE1BQU0sR0FBRyxHQUFHLENBQUksS0FBUSxFQUFFLEdBQU0sRUFBSyxFQUFFLENBQUMsSUFBQSxXQUFHLEVBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0FBQTNELFFBQUEsR0FBRyxPQUF3RCJ9