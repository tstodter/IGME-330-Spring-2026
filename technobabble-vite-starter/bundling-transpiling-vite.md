# Bundling and Transpiling Assignment — Vite + Technobabble

**Goal:** Migrate this **Technobabble** starter project into a **Vite** build.

This is a working multi-module ES6 app with 7 JS files, a CSS file, and a JSON data file loaded at runtime via `fetch()`. Your job is to get it running inside a Vite project so it can be bundled for production.

**Starter file structure:**

```
technobabble-vite-starter/
  index.html
  styles/main.css
  src/main.js          ← entry point
  src/ui.js            ← DOM interaction
  src/babble-engine.js ← generates babble strings
  src/data-loader.js   ← fetches JSON data
  src/history.js       ← localStorage history
  src/stats.js         ← session stats
  src/utils.js         ← pure utility functions
  data/babble-data.json
```

## Steps

1. Create a new Vite project:
   ```bash
   npm create vite@latest lastname-firstinitial-bundling -- --template vanilla
   cd lastname-firstinitial-bundling
   npm install
   ```

2. Copy the starter's `src/` folder (all 7 JS files) into the Vite project's `src/`, replacing the generated `main.js`.

3. Copy `styles/main.css` into `styles/` in the Vite project.

4. Replace the generated `index.html` with the starter's `index.html`.

5. **Handle the JSON data file.** The app loads `data/babble-data.json` via `fetch()` at runtime — it is NOT imported in JavaScript. Vite only bundles files that are `import`ed; files loaded by URL at runtime need to go in the **`public/`** folder.
   - Copy `data/babble-data.json` into `public/data/babble-data.json`
   - Vite serves everything in `public/` at the site root, so `fetch("data/babble-data.json")` will still work

   > **Why does this matter?** This is a common gotcha. If you put `babble-data.json` in `src/` and don't `import` it, Vite won't include it in the build and the app will break in production with a 404. The `public/` folder is Vite's answer for static assets that aren't part of the module graph.

6. `npm run dev` → verify the app works (generate babble, check history, check stats).

7. `npm run build` → verify the production build.

8. `npm run preview` → open the preview URL and confirm everything still works in the bundled version.

## Things to look for after building

- How many files are in `dist/`? Are there more or fewer than the 7 source JS files? Why?
- Open `dist/assets/` and look at the bundled JS. Can you find code from `utils.js` and `babble-engine.js` in the same file?
- Is `babble-data.json` in `dist/`? Where?

## Submission

* Include **both** your source and the production build:
  * `index.html`, `src/`, `styles/`, `public/` (source files)
  * `dist/` folder (production build)
* **Do not include** `node_modules/`.
* Zip the project folder (`lastname-firstinitial-bundling`) and upload to myCourses.
