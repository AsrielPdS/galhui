import { writeFile } from "fs/promises";
import { } from "./themes/basic.js"
import { } from "./themes/material.js"
import { } from "./themes/semantic.js"
import { } from "./themes/bootstrap.js"

export async function buildTheme() {
    throw "not implemented";
    await Promise.all([
        writeFile("themes/basic.css",),
        writeFile("themes/material.css",),
        writeFile("themes/semantic.css",),
        writeFile("themes/bootstrap.css",),
    ]);
}