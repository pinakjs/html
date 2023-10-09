# pinak-html

Welcome to the official documentation for `pinak-html`! This parsing library seamlessly converts HTML into virtual nodes, providing powerful DOM manipulation capabilities for your applications.

## Introduction

`pinak-html` is a JavaScript library designed for parsing and converting HTML into virtual nodes (JavaScript objects). While originally developed for [PinakJs](https://github.com/pinakjs/pinak), it is also compatible with other frameworks, such as ReactJs, that require virtual nodes. The library's syntax closely resembles JSX, with the only difference being the use of JavaScript template syntax instead of curly braces for expressions.

```jsx
<div id={10}>Hello {'World'}</div>

// Equivalent with this library
htm`<div id=${10}>hello ${'World'}</div>`
```

- **Author:** Anuj Kumar
- **Email:** thestackmastery@gmail.com
- **License:** MIT

## Installation

- Install `pinak-html` using your preferred package manager. Open your terminal and run:

    ```bash
    # using npm
    npm install pinak-html

    # using pnpm
    pnpm add pinak-html
    ```

- Or use `CDN`, if you need to use it directly in the broowser. For Local project download it directly from `CDN` links.

    ```html
    <!-- This'll created `PinakHtml` global variable. -->
    <script src="https://cdn.jsdelivr.net/npm/pinak-html"></script>

    <!-- Or you nedd any specific version -->
    <script src="https://cdn.jsdelivr.net/npm/pinak-html@1.0.0"></script>
    ```


## Features

- Efficient creation of virtual nodes from HTML strings.
- Lightweight and optimized for performance.
- MIT licensed for flexibility in usage.

## Getting Started

To start using `pinak-html`, follow these steps:

1. **Import the library:**

   Import the library into your project like this:

   ```js
   import PinakHtml from 'pinak-html';
   ```

   If you are using `CDNs` then `PinakHtml` will be available library.

2. **Create instance**

   Create an instance of PinakHtml by providing a node builder function and, if needed, a directive builder function (useful for [PinakJs](https://github.com/pinakjs/pinak)).

    ```js
    const html = PinakHtml(
        (name, props, children) => ({ name, props, children }), 
        (name, value, ...rest) => ({ name, value, rest })
    )

    // If using Pinakjs
    import { use, h } from 'pinak'

    const html = PinakHtml(h, use)
    ```

3. **Parsing Html**

    Now use the html function to parse HTML from a string.

    ```js
    const result = html`<div>Hi! From Pinak.</div>`
    console.log(result)

    // {
    //     type: 'div',
    //     props: null,
    //     children: "Hi! From Pinak."
    // }
    ```
    It is not necessary to write a single-root HTML; this library can parse multi-root HTML as well.

    ```js
    const result = html`<h1>Hi!</h1><span> From Pinak.</span>`
    console.log(result)

    // [
    //     {
    //         type: 'h1',
    //         props: null,
    //         children: "Hi!"
    //     },
    //     {
    //         type: 'span',
    //         props: null,
    //         children: " From Pinak."
    //     }
    // ]
    ```

    Like `JSX`, JavaScript expressions can be used in the HTML.

    ```js
    const result = html`<h1>Count: ${100}</h1>`
    console.log(result)

    // {
    //     type: 'h1',
    //     props: null,
    //     children: 'Count: 100'
    // }

    /* or */
    const dummyFn = () => {}
    const result = html`<${dummyFn}>Count: ${dummyFn}<//>`
    console.log(result)

    // {
    //     type: () => {},
    //     props: null,
    //     children: [
    //         'Count: ',
    //         () => {}
    //     ]
    // }
    ```

    HTML elements also have props.

    ```js
    const result = html`<h1 name="h1" id=${10} other />`
    console.log(result)

    // {
    //     type: 'h1',
    //     props: {
    //         name: 'h1',
    //         id: 10,
    //         other: true
    //     },
    //     children: null
    // }
    ```

    If you are using [PinakJs](https://github.com/pinakjs/pinak) ], directives can be used as follows.

    ```js
    html`<div use:input="value" ></div>`

    html`<div use:${countFn} ></div>`

    html`<div use:${countFn}="value" ></div>`

    html`<div use:input=${countFn} ></div>`

    html`<div use:input></div>`

    html`<div use:input:opt1:opt2=${countFn} ></div>`
    ```

## Contribution

Contributions to `pinak-html` are welcome! If you have any bug fixes, improvements, or new features to propose, please follow these steps:

1. Fork the repository.
2. Create a new branch for your changes.
3. Implement your changes and ensure all tests pass.
4. Submit a pull request describing your changes and their purpose.

## License

`pinak-html` is released under the MIT license. For more information, please refer to the [LICENSE](./LICENSE) file.

---

Thank you for choosing `pinak-html!` If you have any questions or need assistance, feel free to reach out via email or by opening an issue on the GitHub repository. We hope this library enhances the reactivity of your JavaScript applications. Happy coding!
