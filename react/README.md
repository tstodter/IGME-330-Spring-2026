# React Amiibo App

## I. Overview
- Let's see how we can build a React app that consumes a web service
  - we will get more practice with components ...
  - and with React's *"Reactivity"* - meaning *data binding* ...
  - and with the 2 React hooks we've talked about in class:
    - [`useState()`](https://react.dev/reference/react/useState)
      - [State: A Component's Memory](https://react.dev/learn/state-a-components-memory)
    - [`useEffect()`](https://react.dev/reference/react/useEffect)
      - [Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects)
      - [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
---

## II. Amiibo API

- Docs: https://amiiboapi.org/docs/
- Playground: https://amiiboapi.org/
- Sample call: https://amiiboapi.org/api/amiibo/?name=mario

---

## III. Get Started

- Create folder named **amiibo-app** and `cd` into it
- Type: `npm create vite@latest`
  - for *Project name*: **type a period** (`.`) to create a project in current **amiibo-app** folder
  - for *Framework*: choose **React**
  - for *Variant*: choose **JavaScript**
- `npm i`
- `npm run dev`
- Head to localhost to see app running in browser
- Delete the files and folders you don't need:
  - delete the **src/assets/** folder (hero.png, react.svg, vite.svg)
  - delete the **public/** folder (icons, etc.)
  - you can also delete **eslint.config.js** and **README.md** if you like
- You should be left with these files in **src/**:
  - **App.jsx**
  - **App.css** — clear out its contents (it's all Vite landing-page styles)
  - **main.jsx**
  - **index.css**
    - to get rid of the vertical centering, comment out or delete `min-height: 100svh;`
- And in the project root:
  - **index.html**
    - change the `<title></title>` to "Amiibo Finder"
    - remove the `<link rel="icon" ...>` line (the file it points to no longer exists)
- Make **App.jsx** look like this:

```jsx
import { useState } from "react";
import './App.css'

const App = () => {
  return <>
    <header>
      <h1>Amiibo Finder</h1>
    </header>
    <hr />
    <main>
      <button>Search</button>
      <label>
        Name: 
        <input />
      </label>
    </main>
    <hr />
    <footer>
      <p>&copy; 2026 Ace Coder</p>
    </footer>
  </>;
};

export default App;
```

- View the app in the web browser to be sure it compiles - see below:

---

![screenshot](images/_react/amiibo-react-app-0.png)
  
---

## IV. Create a fetch helper function

- In **App.jsx**, *above* the `App` component, declare this constant

```js
// app "globals" and utils
const baseurl = "https://amiiboapi.org/api/amiibo/?name=";
```

- And implement `searchAmiibo()` - a helper that `fetch`es a name and returns a Promise that resolves to the parsed JSON

```js
const searchAmiibo = (name) => {
  return fetch(`${baseurl}${name}`)
    .then(response => {
      if (!response.ok) throw new Error(`Failed: ${response.status}`);
      return response.json();
    });
};
```

- This is the same `fetch` + `.then()` pattern we used for the Dad Jokes demo
- Unlike Dad Jokes, the Amiibo API is happy returning JSON by default — no `Accept` header needed

---

## V. Test it

- Let's call `searchAmiibo()` once just to prove the pipe is connected. Temporarily, inside the `App` component, add:

```js
  searchAmiibo("mario")
    .then(data => {
      console.log(`Number of results=${data.amiibo.length}`);
      data.amiibo.forEach(a => console.log(a.character));
    })
    .catch(error => console.error(error));
```

- Open the browser console — you should see the count and a list of Mario-related characters
- Try substituting "luigi", "peach" and "rit" to see what you get back
- **Remove this test code before moving on** — calling `searchAmiibo` at the top of the component body would run on every render (same problem we saw with Dad Jokes)

---

## VI. Hook the code up to the UI

- Goal: When we click the button, we want to see the web service results of the typed in search term (character name)
- 1 - We will need a `useState()` call for `term`
  - need to bind the `<input>` `.value` to `term` (a *controlled input*, just like the hero list demo)
  - need to update `term` whenever `.value` changes via `onChange`

```jsx
<input
  value={term}
  onChange={e => setTerm(e.target.value)}
/>
```

- 2 - We need to get button clicking working (call `searchAmiibo` and store the results)
  - use `onClick={...}` and wrap the call in an arrow function
- 3 - We will need a `useState()` call for `results` (an array of object literals)
  - set the initial value to an empty array - `[]`
- 4 - We need to display the `results`

```jsx
      {results.map(amiibo => (
        <span key={amiibo.head + amiibo.tail} style={{color:"green"}}>
          <h4>{amiibo.name}</h4>
          <img 
            width="100" 
            alt={amiibo.character}
            src={amiibo.image}
          />
        </span>
      ))}
```

- Note the React need for a unique `key` when producing lists like this (same story as the hero list)
- Also note the syntax for the use of an inline `style` - using a `class` for styling is generally preferred in React

---
  
- Next, wire the click handler. `searchAmiibo` returns a Promise, so we chain `.then()` to update state when it resolves:

```jsx
<button onClick={() => {
  searchAmiibo(term)
    .then(data => setResults(data.amiibo || []))
    .catch(error => console.error(error));
}}>Search</button>
```

- When the data comes back, `setResults` updates state, React re-renders, and the `<span>` list appears
- When you are done, you should have a functioning app:

---

![screenshot](images/_react/amiibo-react-app-1.png)

---

## VII. A little refactoring - api.js - a "plain old JS" file

- Go ahead and create a file in the **src** folder named **api.js**
  - move `const searchAmiibo = (name) =>...` into it and `export` it
  - now `import` it into **App.jsx** - `import { searchAmiibo } from "./api";`
    - note that we don't need the file extension for the file when we `import` it
  - test the app, it should work as before
  - now the only "global" you have left in **App.jsx** is `const baseurl =...` — move that into **api.js** too
 
---

## VIII. storage.js
- We are going to utilize `window.localStorage` to save the current search term, so that when the user leaves the app (closes the window, quits the browser, restarts the computer etc), and then later returns, that search term will still be in the `<input>` as if they never left
- Create a new file named **src/storage.js** - and make it look like this:

```js
const storeName = "abc1234-amiibo-app";

const loadJSONFromLocalStorage = () => {
  const string = localStorage.getItem(storeName);
  let json;
  try{
    json = JSON.parse(string);
    if(!json) throw new Error("json is null!");
  }catch(error){
    console.log(`ERROR: ${error} with string: ${string}`);
    json = {};
  }
  return json;
};

export const writeToLocalStorage = (key, value) => {
  console.log(`Calling writeToLocalStorage(${key},${value})`);
  const json = loadJSONFromLocalStorage();
  json[key] = value;
  localStorage.setItem(storeName, JSON.stringify(json));
};

export const readFromLocalStorage = (key) => {
  const json = loadJSONFromLocalStorage();
  console.log(`Calling readFromLocalStorage(${key}) with value=${json[key]}`);
  return json[key];
}
```

- Over in **App.jsx**, `import` it
  - `import { readFromLocalStorage, writeToLocalStorage } from "./storage";`
- N.B. - this code is more than we need to store a single string value, and was deliberately over-engineered so that you could (for example) easily also save an array of search terms (the search *history*), or an array of the most recent amiibo results, or an array of amiibo favorites, etc

---

## IX. Utilize storage.js

- We are going to save the search `term` every time the value of `term` changes
- We are going to use the `useEffect()` hook to do so — the exact same "side effect on a state change" pattern from the Dad Jokes demo
- Go ahead and modify your `react` import to also bring in `useEffect`
  - `import { useEffect, useState } from "react";`
- Add the following code to the `App` component right after the two `useState()` calls

```jsx
useEffect(() => {
  writeToLocalStorage("term", term);
});
```

- `useEffect()` will call the provided function - which saves the value of `term` to local storage - every time the `App` component is re-rendered
- Do a search by clicking the Search button, or type in a different name. Then check `localStorage` in the browser's web inspector (the **Application** tab) to see that the value of `term` is being saved

---

![screenshot](images/_react/amiibo-react-app-2.png)

---

## X. Optimization with a dependency array

- Right now `useEffect()` is being called every time the `App` component re-renders (for example, when the Search button is clicked), even if the value of `term` has not changed
  - to make it so that `useEffect()` will only be called when the value of `term` changes, add a *dependencies array* to the end:
 
```jsx
useEffect(() => {
  writeToLocalStorage("term", term);
}, [term]);
```

- Dependency array == `[]` means "run on mount"
- Dependency array == `[something]` means "run when *something* changes"
- Dependency array == no array means "run every render"

Test the app by clicking the Search button and check the console, there should be fewer logs from the storage functions, as they will only be called when `term` changes
  - N.B. In development mode (the mode we are in now), React does some extra re-rendering of components

---

## XI. Load the saved search term

- Now let's load the value of `term` from `localStorage` when the app first loads - go ahead and make the first part of the `App` component look like this:

```jsx
const App = () => {
  const savedTerm = readFromLocalStorage("term") || "";
  const [term, setTerm] = useState(savedTerm);
  const [results, setResults] = useState([]);

  useEffect(() => {
    writeToLocalStorage("term", term);
  }, [term]);

  // ... rest of App below
```

- We should now see the last search `term` in the `<input>` whenever we reload the web page, or even if we close the window and reopen it
- If you check the console, `readFromLocalStorage` is running on every render. For an app this small that's totally fine — it's just reading one key from `localStorage`. React has a hook (`useMemo`) that can cache results between renders, but we haven't covered it and we don't need it here.

---

## XII. Debugging with React Developer Tools

- The console has been giving us helpful React error messages along the way - but there are more powerful developer tools we could use
- Go ahead and install the [React Developer Tools for Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- Now check the Web Inspector - the **Components** tab:

---

![screenshot](images/_react/amiibo-react-app-3.png)

---

- Above you should see the component hierarchy (just one App component as of now), and the values of the `App` state variables (`term` and `results`) live-updating as you interact with the app

---

## XIII. Factor out some code and create separate components

### XIII-A. Footer.jsx

- We'll do the footer together

**src/Footer.jsx**

```jsx
const Footer = ({name, year}) => {
  return <footer>
    <p>&copy; {year} {name}</p>
  </footer>;
};
export default Footer;
```

- Next, `import` it at the top of **App.jsx**
- Finally, replace:

```jsx
<footer>
  <p>&copy; 2026 Ace Coder</p>
</footer>
```

- with:

```jsx
<Footer 
  name="Ace Coder"
  year={new Date().getFullYear()}
/>
```

- Test the app, it should work as before

---

### XIII-B. Header.jsx
- Easy!
- Just pass in `title` as a prop!
---

### XIII-C. AmiiboList.jsx
- Easy!
- Keep the "state" in **App.jsx**, and just pass in `results` as a prop

---

### XIII-D. AmiiboSearchUI.jsx
- Easy! (mostly)
- Keep the "state" in **App.jsx**, and just pass in:
  - `term`
  - `setTerm`
  - `searchAmiibo`
  - `setResults`
- as props
- This is the "lifting state up" pattern — the state lives in `App`, and child components receive the values and setters they need via props

---

**React Web Inspector**

![screenshot](images/_react/amiibo-react-app-4.png)

---

**App.jsx**

![screenshot](images/_react/amiibo-react-app-5.png)

---

## XIV. Publish it
- To create a transpiled version (React JSX -&gt; Vanilla JS/HTML that you can put on the web:
  - type ctrl-c to quit `vite`
  - type `npm run build`
  - now you will see the **dist/** folder has been populated with an **index.html** file, a **.js** file and a **.css** file - this is the "transpiled and bundled" version that's ready for distribution
    - you can test it locally by running just this **dist/** folder on Live Server
    - PS - if you put these files on banjo, you'll need to first fix the `href` attributes of the `<script>` and `<link>` tags
      - hint: add a `.` to the beginning of the `src` and `href` urls
- Be sure to "View Page Source" and "Inspect" the DOM on the built version - where's all the JSX?

---

## XV. Discussion
- Decomposing the app UI into distinct *components*
- Difference between the typical DOM apps we've written (e.g. Technobabble) and how a React app works:
  - Code and HTML are no longer separate - there's "inline JS" - which is traditionally frowned on!
  - `document.querySelector()`, `.innerHTML` et al aren't needed — React owns the DOM
- Having a single "source of truth" for each piece of state
  - https://en.wikipedia.org/wiki/Single_source_of_truth
- Sharing state between components by "lifting state up" - https://react.dev/learn/sharing-state-between-components
  - passing setters and values as props — see the `AmiiboSearchUI` component
- React Browser Debugger Tools
- Reusable code factored out into regular JS files - e.g. **storage.js** and **api.js**

---

## XVI. Anything else?

- This app would benefit from:
  - better CSS/layout - a framework with a `.card` class to display the results would be nice
  - better UI:
    - show a "spinner" when a search is going on, then hide it when the search is complete (use an `isLoading` state variable — same pattern as Dad Jokes)
    - show an error message if the fetch fails (use an `error` state variable — same pattern as isLoading from Dad Jokes)
    - show the number of results found
    - add tool tips
    - save the contents of the most recent `results` array in `.localStorage`
    - allow users to "favorite" and view previously searched amiibo - and store these in `.localStorage`
    - allow users to "page through" results 5 or 10 at a time
   
---

## XVII. Rubric

- 60% - Get through Part XII. with everything working 
- +10% - get `Footer` working
- +10% - get `Header` working
- +10% - get `AmiiboList` working
- +10% - get `AmiiboSearchUI` working
