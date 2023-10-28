import { writeFile } from "fs/promises";
import { style as basicStyle, darkTheme as basicDarkTheme, lightTheme as basicLightTheme } from "./themes/basic.js"
import { } from "./themes/material.js"
import { } from "./themes/semantic.js"
import { } from "./themes/bootstrap.js"

export async function buildThemes() {
  function multColor(light, dark) {
    let t = "@media(prefers-color-scheme";
    return `${t}:light){${light.css}}${t}:dark){${dark.css}}`;
  }
  await Promise.all([
    writeFile("themes/basic.css", multColor(basicStyle(basicLightTheme()),basicStyle(basicDarkTheme()))),
    writeFile("themes/basic.dark.css", basicStyle(basicDarkTheme()).css),
    writeFile("themes/basic.light.css", basicStyle(basicLightTheme()).css),
    // writeFile("themes/material.css",),
    // writeFile("themes/semantic.css",),
    // writeFile("themes/bootstrap.css",),
  ]);
}