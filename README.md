

# Waiter and AUTRATAC
This project aims to help developers to make their code more robust by adding the functionality of delaying code. The `Waiter` code enables new dead code elimination techniques by making code more robust regarding missing code. In this case, parts of the code can be called, even if the targetted function is not available (yet). As `Waiter` needs to be inserted into all function calls, a second framework (`AUTRATAC`) is provided that automatically inserts the calls into your code. 

## Using Waiter:

To use `Waiter`, simply add the content of [waiter.min.js](https://github.com/waiter-and-autratac/WaiterAndAUTRATAC/blob/main/waiter.min.js) to your Web page before the first call to `Waiter`. This provides the `__w` function globally. In this case, in asynchronous functions, it can be used like this:

```JavaScript
async function a(){
  await __w(()=>b());
}

//load later:
async function b(){}
```

This code will work regardless if function `b()` is available directly or later. If the code is unavailable, `Waiter` will wait for you and serve the answer once available.

## Using AUTRATAC

Using AUTRATAC depends more on how your web page is built. It is a Babel plugin that can be inserted via Webpack, or called directly via code. For example, when using it via code, the code will look like this:

```TypeScript

const babel = require('babel-core');
import AUTRATAC from './AUTRATAC'

const code = `async function a(){b()}`

const results = await babel.transform(code, {
        plugins: [[AUTRATAC]]
    })

```

## How it Works

`AUTRATAC` will convert all function calls contained in asynchronous functions. In this case, your source code needs to be adapted. To convert a synchronous function to an asynchronous equivalent, add `async` before every `function` and `await` all function calls. 

## Troubleshooting

*Help, `Waiter` does not work!*
- In some instances, we suspect that the `MutationObserver` will not fire correctly due to Browser-specific implementations. If this is the case, then the `MutationObserver` can be replaced with a `setInterval`, and a `clearInterval` in the `Waiter`-code when the call is successful. 
- Make sure that the code is using async/await correctly. 
- Make sure that Waiter can actually be called and is in scope. 

*Help, AUTRATAC does not work!*
- Currently, AUTRATAC is only tested with vanilla JavaScript. Keep that in mind when converting framework-specific code.

## Help Wanted!
- If you have feedback or found bugs, let us know by opening an issue or a pull request.

## About

This code was developed as a research project by [Lucas Vogel](https://github.com/lucasvog) of the [TU Dresden Chair of Computer Networks](https://tu-dresden.de/ing/informatik/sya/professur-fuer-rechnernetze?set_language=en).
