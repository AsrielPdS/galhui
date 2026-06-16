import { G, g, getAll, isE } from "galho";
import { filter, isF, isS, z } from "galho/util.js";
import type { Dic, Task, bool, falsy, str } from "galho/util.js";

/**
 * Sets up a click handler on element `s` to update the location hash to the specified value.
 * @param s The element that triggers the hash change when clicked.
 * @param value The value to set as the location hash.
 */
export const hash = (s: G, value: str) => s.on("click", () => location.hash = value);

/**
 * Initializes the router with the specified root elements, starts listening to hash changes,
 * and clears the current path state.
 * @param routeRoot The root elements where routed contents are rendered.
 */
export function init(...routeRoot: G[]) {
  root = routeRoot.map(r => r.e);
  window.onhashchange = () => goTo(location.hash);
  current = currentPath = null;
}

/**
 * A callback function signature called to update a route when its parameters change.
 */
export type Update = (...path: string[]) => Task<void | (G | Element)[]>;

/**
 * The expected output structure of a route handler, which can be an array of elements or
 * a tuple containing the elements and an update callback.
 */
export type RouteResult = G[] | [view: G[] | falsy, onupdate: Update];

/**
 * A route handler definition. Can be a static RouteResult, or a function that dynamically
 * returns a RouteResult or void (possibly asynchronously).
 */
export type Route = RouteResult | ((...path: string[]) => Task<RouteResult | void>);

/**
 * A dictionary of route handlers mapping path keys to Route definitions.
 */
export type Routes = Dic<Route>;

var root: Element[], current: Update;

/** The current active route path key. */
export var currentPath: str;

/** The previous active route path key. */
export var prevPath: str;

/** The full current active path including sub-paths. */
export var fullPath: str;

const routes: Routes = {};

/**
 * Registers one or more route handlers.
 * @param handlers A dictionary mapping keys to route handlers.
 */
export function addRoute(handlers: Routes): void;
/**
 * Registers a route handler for the specified key.
 * @param key The path key to register.
 * @param handler The route handler.
 */
export function addRoute(key: str, handler: Route): void;
export function addRoute(key: str | Routes, handler?: Route) {
  if (isS(key))
    routes[key] = handler;
  else for (let k in key)
    routes[k] = key[k];
}

/**
 * Registers route handlers.
 * @deprecated Use {@link addRoute} instead.
 */
export function add(handlers: Routes): void;
/**
 * Registers a route handler.
 * @deprecated Use {@link addRoute} instead.
 */
export function add(key: str, handler: Route): void;
export function add(key, handler?) {
  addRoute(key, handler);
}

/**
 * Replaces the elements currently rendered in the router's root with the new set of elements.
 * @param t The new elements to display.
 */
export function set(t: (G | Element | falsy)[]) {
  let p = g(root[0]).parent, i = -1;
  while (p.child(++i).e != root[0]);

  for (let e of root)
    e.remove();
  p.place(i, root = filter(t).map(v => isE(v) ? v.e : v));
}

/**
 * Appends the specified elements to the router's root.
 * @param items The elements to append.
 */
export function push(...items: (G | Element | falsy)[]) {
  let t = filter(items.map(v => v && (isE(v) ? v.e : v)), v => v && !root.includes(v));
  g(z(root)).after(t);
  root.push(...t);
}

/**
 * Removes the specified elements from the router's root.
 * @param items The elements to remove.
 */
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
let e: Intercept[] = [], defRoute: str;

/**
 * Registers a route interception handler that can inspect, transform, or cancel navigation actions.
 * @param v The intercept callback.
 */
export function intercept(v: Intercept) {
  e.push(v);
}

/**
 * Checks whether a route handler exists for the given path key.
 * @param path The path string to verify.
 */
export function has(path: str) {
  return path.split('/', 2)[0] in routes;
}

/**
 * Gets or sets the default fallback route path used when a requested path is not found.
 * @param value Optional default path to set.
 * @returns The current default route path.
 */
export function defaultRoute(value?: str) { return value === void 0 ? defRoute : defRoute = value; }

/**
 * Triggers navigation to the specified path, processing any registered interceptors.
 * @param path The path to navigate to, optionally starting with '#'.
 */
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
    prevPath = currentPath;
    fullPath = path;
    currentPath = key;
    let dt = isF(route) ? await route(...sub) : route;
    if (dt && isF(dt[1])) {
      current = dt[1];
      dt = dt[0] as G[];
    }
    if (dt)
      set(dt as G[]);
  }
  setTimeout(updateAnchors);
  if (current) {
    let _ = await current(...sub);
    _ && set(_);
  }
}

/**
 * Updates page anchor tags whose href matches the current hash by toggling the "on" class.
 */
export function updateAnchors() {
  getAll('a.on[href^="#"]').do(e => e.c("on", false));
  getAll(`a[href="${location.hash}"]`).c("on");
}

/**
 * Triggers a hot route reload using the current location hash.
 */
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