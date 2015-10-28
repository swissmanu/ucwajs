# ucwajs
Implements very basic functionality to communicate with the Skype for Business Web API (UCWA).

## Experimental!
This library is in a very experimental state. Do expect problems and obstacles ahead 💩

## Configuration & Preparation
Run `npm install` and create a copy of `config.sample.json` named `config.json`. Fill in your Skype for Business credentials.


## Run
```bash
npm run
```

## Debug
`ucwajs` uses `debug` to provide traces during runtime. Enable them by passing the `DEBUG` environment variable:

```bash
DEBUG=ucawjs npm run
```

## Reference

* https://www.matthewproctor.com/Send-An-IM-With-UCWA-Creating-the-Application/
* https://ucwa.skype.com/code
* https://ucwa.skype.com/documentation/GettingStarted-RootURL
* https://ucwa.skype.com/documentation/GettingStarted-Authentication

## License

Copyright (c) 2015 Manuel Alabor

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.