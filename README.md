# Galho UI 🍃✨

A comprehensive, lightweight UI component and routing library built on top of the [Galho](https://github.com/AsrielPdS/galho) framework. 
It provides everything you need to build dynamic, responsive, and data-bound web applications without the overhead of Virtual DOMs or complex build tools.

---

## Features

- **Ready-to-use UI Components:** Buttons, inputs, dialogs, sidebars, and more.
- **Form Management & Validation:** Built-in form controllers with out-of-the-box data validation and error handling.
- **Client-Side Routing:** Simple and effective hash-based routing system with interception and lazy-loading support.
- **CSS-in-JS Styling Helpers:** Create type-safe, dynamic styles using JavaScript.
- **Icon Support:** Integrated SVG icon system (`icon`, `logo`).
- **Reactive Data Binding:** Fully compatible with Galho's `orray` and `Component` paradigms.

---

## Installation

Since `galhui` is built on top of `galho`, you will need both packages:

```bash
npm install galho galhui
```

*(Note: Adjust installation based on your project setup, as `galhui` uses `file:../galho` in development)*

---

## Core Modules

### 1. Elements & Components (`galhui.ts`)

The core module provides helper functions to instantly build DOM elements wrapped in Galho's `G` and `M` wrappers.

#### Buttons & Links
* **`bt(text, click, type)`**: Standard text button.
* **`ibt(icon, text, click, type)`**: Icon button.
* **`positive(...)` / `negative(...)`**: Semantic action buttons (Accept/Reject).
* **`link(text, href)` / `ilink(icon, text, href)`**: Navigation anchors.
* **`cancel(click)` / `confirm(click)`**: Standardized action buttons.

#### Layouts & Modals
* **`dialog(cls, header, body, blur)`**: Creates a modal dialog.
* **`sidebar(header, body, blur)`**: Creates a side-drawer overlay.
* **`notify(content, config)`**: Generates automatic self-dismissing toast notifications.
* **`menu(items)` / `menubar(...)`**: Standard menu and toolbar layouts.

#### Forms & Inputs
* **`input(type, name, placeholder, onInput)`**: Standard input wrapper.
* **`search(onInput, value)`**: Specialized search field with icon.
* **`checkbox(label, onInput, checked)`**: Checkbox toggle.

---

### 2. Advanced Forms & Validation (`form.ts`)

Provides robust form handling, data aggregation, and validation tracking.

* **`Form` Class**: Wraps an HTML `<form>`, tracking all child `Input` components.
  * *Methods*: `.valid()`, `.data()`, `.fill()`, `.reset()`.
* **Input Types**: `TextIn`, `NumbIn`, `CheckIn`, `TimeIn`.
  * *Features*: Built-in validation constraints (e.g., `req`, `min`, `max`, `pattern`).
* **`mdform(header, form, callback)`**: Opens a form inside a modal dialog and resolves a Promise upon valid submission.

**Example: Building a Validated Form**
```javascript
import { Form, textIn, numbIn } from "galhui/form.js";
import { confirm, cancel } from "galhui/galhui.js";

const myForm = new Form([
  textIn("username", true).p({ ph: "Enter your username" }), // Required
  numbIn("age", false, "Your Age") // Optional number
]);

// Wait for the user to submit valid data
const formData = await mdform("User Setup", myForm);
console.log(formData.username, formData.age);
```

---

### 3. Routing (`route.ts`)

A lightweight hash-based router.

* **`init(...rootElements)`**: Initializes the router and mounts it to DOM elements.
* **`addRoute(path, handler)`**: Registers a route. Handlers can be synchronous or asynchronous.
* **`goTo(path)`**: Navigates programmatically.
* **`intercept(handler)`**: Adds middleware to inspect or block route changes before they resolve.

**Example: Basic Routing**
```javascript
import { init, addRoute, goTo } from "galhui/route.js";
import { div, g, get } from "galho";

// 1. Initialize router on a container
init(get("#app-root"));

// 2. Define routes
addRoute({
  "home": () => [div(0, "Welcome to the Home Page!")],
  "about": () => [div(0, "About Us")]
});

// 3. Navigate
goTo("home");
```

---

### 4. Styling Utilities (`style.ts`)

Provides helpers for programmatic CSS generation and standardization.

* **`rgba(r, g, b, a)` / `rgb(r, g, b)`**: Color formatters.
* **`spc(value, unit)`**: Margin/padding CSS string generator.
* **`styleCtx(options)`**: Context aggregator for complex CSS-in-JS rule building.

---

## License

This project is licensed under the ISC License.