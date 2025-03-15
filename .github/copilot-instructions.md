
## Tests

When writing tests do the following

Use test from @bearz/testing.

```ts
import { test } from "@bearz/testing";
```

Use asserts methods as needed from @bearz/asserts
such as but not limited to, `ok`, `nope`, `equal`,
`throws`, `rejects`, etc.

```ts
import { equal, ok, throws } from "@bearz/assert";
```

Prefix the test name with the module name without
the scope and then function, class, const and
context. For example

```ts
import { test } from "@bearz/testing";
import { equal } from "@bearz/assert";
import { Slice } from "./slice.ts";

test("slices::Slice.length gets the length of the slice",  ()  => {
   const s = new Slice([0, 1, 2], 1);
   equal(2, s.length);
})

```

## Documentation

When generating documentation always include the original code and 
add the doc comments.

When generating documentation for a TypeScript or JavaScript constructor use
the template "Creates a new instance of {{Type}}" where "{{Type}} is the name of
the class for the summary.

```typescript

export class AssertError extends Error {
   

    /**
     * Creates a new instance of AssertError
     * @param message The error message.
     * @param options Optional. The options for the error.
     */
    constructor(message: string, options?: AssertErrorOptions) {
        super(message, options);
        this.name = "AssertError";
        this.link = options?.link ?? "https://jsr.io/@bearz/assert/docs/assert-error";
        this.target = options?.target
    }
}

```
