import { g, getAll, isE } from "galho";
import { filter, isF, isS, z } from "galho/util.js";
export const hash = (s, value) => s.on("click", () => location.hash = value);
export function init(...routeRoot) {
    root = routeRoot.map(r => r.e);
    window.onhashchange = () => goTo(location.hash);
    current = currentPath = null;
}
var root, current;
export var currentPath;
const routes = {};
export function add(key, handler) {
    if (isS(key))
        routes[key] = handler;
    else
        for (let k in key)
            routes[k] = key[k];
}
export function set(t) {
    let p = g(root[0]).parent, i = -1;
    while (p.child(++i).e != root[0])
        ;
    for (let e of root)
        e.remove();
    p.place(i, root = filter(t).map(v => isE(v) ? v.e : v));
}
export function push(...items) {
    let t = filter(items.map(v => v && (isE(v) ? v.e : v)), v => v && !root.includes(v));
    g(z(root)).after(t);
    root.push(...t);
}
export function pop(...items) {
    for (let e of items) {
        let index = root.findIndex(t => t == e.e);
        if (index != -1) {
            root.splice(index, 1);
        }
        e.remove();
    }
}
// _intercept: Intercept, 
let e = [], defRoute;
export function intercept(v) {
    e.push(v);
}
export function has(path) {
    return path.split('/', 2)[0] in routes;
}
export function defaultRoute(value) { return value === void 0 ? defRoute : defRoute = value; }
export async function goTo(path) {
    if (path[0] == '#')
        path = path.slice(1);
    has(path) || (console.warn(`path '${path}' not found.`), path = defRoute || "");
    let sub = path.split('/'), key = sub.shift();
    let canceled, o = { cancel() { canceled = true; }, sub, path };
    for (let i of e) {
        let t = i(key, o);
        if (canceled)
            return;
        if (t)
            key = (o.sub = sub = (o.path = t).split("/")).shift();
    }
    history.replaceState(null, null, "#" + o.path);
    if (key != currentPath) {
        current = null;
        let route = routes[key];
        if (!route)
            throw 404;
        let dt = isF(route) ? await route(...sub) : route;
        if (dt && isF(dt[1])) {
            current = dt[1];
            dt = dt[0];
        }
        if (dt)
            set(dt);
        currentPath = key;
    }
    updateAnchors();
    current?.(...sub);
}
export function updateAnchors() {
    getAll('a.on[href^="#"]').do(e => e.c("on", false));
    getAll(`a[href="${location.hash}"]`).do(e => e.c("on"));
}
export function hmr() {
    let cp = currentPath;
    currentPath = null;
    try {
        goTo(location.hash);
    }
    catch {
        currentPath = cp;
        console.warn("err parsing current path");
    }
}
