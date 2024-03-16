A side quest of this project is to explore simpler ways of developing JavaScript applications while maintaining most of the benefits provided by everyday development tooling.

Some early guidelines:

- Use plain ES6 `.js` files with import statements referring to actual code files (no `.js` inference)
- Use JSDoc to annotate types with TypeScript type annotations
- Try to automate any style, type, format and testing requirements

Testing:

```sh
npm exec -- eslint ./
npm exec -- prettier --check ./
npm exec -- tsc --noEmit --pretty
node --test
```
