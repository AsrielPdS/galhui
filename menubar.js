"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sep = exports.right = exports.item = exports.menubar = void 0;
const galho_1 = require("galho");
const galhui_1 = require("./galhui");
const menubar = (...items) => (0, galho_1.div)("_ bar", items);
exports.menubar = menubar;
const item = (i, text, action) => (0, galho_1.g)("button", "i" /* item */, [(0, galhui_1.icon)(i), text]).on("click", action);
exports.item = item;
const right = () => (0, galho_1.div)("r" /* right */);
exports.right = right;
const sep = () => (0, galho_1.g)("hr");
exports.sep = sep;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudWJhci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1lbnViYXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUNBQXdDO0FBQ3hDLHFDQUF3RDtBQUdqRCxNQUFNLE9BQU8sR0FBRyxDQUFDLEdBQUcsS0FBWSxFQUFFLEVBQUUsQ0FBQyxJQUFBLFdBQUcsRUFBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFBbkQsUUFBQSxPQUFPLFdBQTRDO0FBQ3pELE1BQU0sSUFBSSxHQUFHLENBQUMsQ0FBTyxFQUFFLElBQVMsRUFBRSxNQUErQixFQUFFLEVBQUUsQ0FBQyxJQUFBLFNBQUMsRUFBQyxRQUFRLGtCQUFVLENBQUMsSUFBQSxhQUFJLEVBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQXpILFFBQUEsSUFBSSxRQUFxSDtBQUMvSCxNQUFNLEtBQUssR0FBRyxHQUFHLEVBQUUsQ0FBQyxJQUFBLFdBQUcsa0JBQWMsQ0FBQztBQUFoQyxRQUFBLEtBQUssU0FBMkI7QUFDdEMsTUFBTSxHQUFHLEdBQUcsR0FBRyxFQUFFLENBQUMsSUFBQSxTQUFDLEVBQUMsSUFBSSxDQUFDLENBQUM7QUFBcEIsUUFBQSxHQUFHLE9BQWlCIn0=