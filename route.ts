import { getAll, S } from "galho";
import { Dic, def, isF, isS, str, Task, z, falses, filter } from "galho/util.js";

export const hash = (s: S, value: str) => s.on("click", () => location.hash = value);
export function init(...routeRoot: S[]) {
  root = routeRoot;
  window.onhashchange = () => goTo(location.hash);
  current = currentPath = null;
}
export type Update = (...path: string[]) => void;
export type RouteResult = S[] | [view: S[] | falses, onupdate: Update];
export type Route = RouteResult | ((...path: string[]) => Task<RouteResult | void>);
export var root: S[], current: Update, currentPath: str;
const routes: { [index: string]: Route } = {};
export function add(handlers: Dic<Route>): void;
export function add(key: string, handler: Route): void;
export function add(key: string | Dic<Route>, handler?: Route) {
  if (isS(key))
    routes[key] = handler;
  else for (let k in key)
    routes[k] = key[k];
}

export function set(t: (S | falses)[]) {
  let p = root[0].parent(), i = -1;
  while (p.child(++i).e != root[0].e);

  for (let e of root) e.remove();
  p.place(i, root = filter(t));
}
export function push(...items: S[]) {
  z(root).putAfter(items);
  root.push(...items);
}
export function pop(...items: S[]) {
  for (let e of items) {
    let index = root.findIndex(t => t.e == e.e);
    if (index != -1) {
      root.splice(index, 1);
    }
    e.remove();
  }
}
type Intercept = (path: str) => void | str;
var _intercept: Intercept, defRoute: str;
export function intercept(v: Intercept) { _intercept = v; }
export function has(path: str) {
  return path.split('/', 2)[0] in routes;
}
export function defaultRoute(value?: str) { return value === void 0 ? defRoute : defRoute = value; }
export async function goTo(path: string): Promise<void> {
  if (path[0] == '#')
    path = path.slice(1);

  _intercept && (path = def(<str>_intercept(path), path));
  has(path) || (path = defRoute || "");
  let keys = path.split('/'), newPath = keys.shift();

  if (newPath != currentPath) {
    current = null;
    let route = routes[newPath];
    if (!route) throw 404;
    currentPath = newPath;
    let dt = isF(route) ? await route(...keys) : route;
    if (dt && isF(dt[1])) {
      current = dt[1];
      dt = dt[0] as S[];
    }
    if (dt) set(dt as S[]);
  }
  history.replaceState(null, null, "#" + path/*`#${}?${dicToQString(params)}`*/);
  getAll("a.on").do(e => e.c("on", false));
  getAll(`a[href="#${path}"]`).do(e => e.c("on"));
  current?.(...keys);
}