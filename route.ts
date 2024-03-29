﻿import { Content, G, One, g, getAll, isE } from "galho";
import { Arr, Dic, Task, bool, falsy, filter, isF, isS, str, z } from "galho/util.js";

export const hash = (s: G, value: str) => s.on("click", () => location.hash = value);
export function init(...routeRoot: G[]) {
  root = routeRoot.map(r => r.e);
  window.onhashchange = () => goTo(location.hash);
  current = currentPath = null;
}
export type Update = (...path: string[]) => Task<void | (G | Element)[]>;
export type RouteResult = G[] | [view: G[] | falsy, onupdate: Update];
export type Route = RouteResult | ((...path: string[]) => Task<RouteResult | void>);
export type Routes = Dic<Route>;

var root: Element[], current: Update;
export var currentPath: str;
const routes: Routes = {};
export function add(handlers: Routes): void;
export function add(key: str, handler: Route): void;
export function add(key: str | Routes, handler?: Route) {
  if (isS(key))
    routes[key] = handler;
  else for (let k in key)
    routes[k] = key[k];
}
export function set(t: (G | Element | falsy)[]) {
  let p = g(root[0]).parent, i = -1;
  while (p.child(++i).e != root[0]);

  for (let e of root)
    e.remove();
  p.place(i, root = filter(t).map(v => isE(v) ? v.e : v));
}
export function push(...items: (G | Element | falsy)[]) {
  let t = filter(items.map(v => v && (isE(v) ? v.e : v)), v => v && !root.includes(v));
  g(z(root)).after(t);
  root.push(...t);
}
export function pop(...items: G[]) {
  for (let e of items) {
    let index = root.findIndex(t => t == e.e);
    if (index != -1) {
      root.splice(index, 1);
    }
    e.remove();
  }
}
type Intercept = (key: str, options: { path: str, sub: str[], cancel(): void }) => void | str;
// _intercept: Intercept, 
let e: Intercept[] = [], defRoute: str;
export function intercept(v: Intercept) {
  e.push(v);
}
export function has(path: str) {
  return path.split('/', 2)[0] in routes;
}
export function defaultRoute(value?: str) { return value === void 0 ? defRoute : defRoute = value; }
export async function goTo(path: string): Promise<void> {
  if (path[0] == '#')
    path = path.slice(1);

  has(path) || (console.warn(`path '${path}' not found.`), path = defRoute || "");
  let sub = path.split('/'), key = sub.shift();
  let canceled: bool, o = { cancel() { canceled = true }, sub, path };
  for (let i of e) {
    let t = i(key, o);
    if (canceled) return;
    if (t)
      key = (o.sub = sub = (o.path = t).split("/")).shift();
  }
  sub = sub.map(s => decodeURIComponent(s));
  history.replaceState(null, null, "#" + o.path);

  if (key != currentPath) {
    current = null;
    let route = routes[key];
    if (!route)
      throw 404;
    let dt = isF(route) ? await route(...sub) : route;
    if (dt && isF(dt[1])) {
      current = dt[1];
      dt = dt[0] as G[];
    }
    if (dt)
      set(dt as G[]);
    currentPath = key;
  }
  setTimeout(updateAnchors);
  if (current) {
    let _ = await current(...sub);
    _ && set(_);
  }
}
export function updateAnchors() {
  getAll('a.on[href^="#"]').do(e => e.c("on", false));
  getAll(`a[href="${location.hash}"]`).c("on");
}

export function hmr() {
  let cp = currentPath;
  currentPath = null;
  try {
    goTo(location.hash);
  } catch {
    currentPath = cp;
    console.warn("err parsing current path");
  }
}