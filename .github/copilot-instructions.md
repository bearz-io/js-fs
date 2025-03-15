
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

Use exec and output found in ../jsr/_testutils.ts to execute
things like `mkdir -p $dir`, `bash -c "echo $content > $sourceFile"`
to create, delete, or update directories and folders when generating
the tests for functions that the tests are not directly testing.

For example the following code use exec to for creating the files
using exec comands and then calls `await link(sourcePath, linkPath);`
and then runs asserts to test the command.

```ts
import { test } from "@bearz/testing";
import { equal, throws, rejects } from "@bearz/assert";
import { link, linkSync } from "./link.ts";
import { join } from "@bearz/path";
import { exec, output } from "./_testutils.ts";

const testData = join(import.meta.dirname!, "test-data");

test("fs::link creates a hard link to an existing file", async () => {
    await exec("mkdir", ["-p", testData]);

    const sourcePath = join(testData, "source1.txt");
    const linkPath = join(testData, "link1.txt");
    const content = "test content";

    try {
        await exec("bash", ["-c", `echo "${content}" > ${sourcePath}`]);
        await link(sourcePath, linkPath);
        
        const o = await output("cat", [linkPath]);
        const linkedContent = o.stdout.trim();
        equal(linkedContent, content);
    } finally {
        await exec("rm", ["-f", sourcePath, linkPath]);
    }
});
```

When testing the internals of functions that reference `globals` and
the test should remove or update objects in `globals` then assign
globals to g using `const g = globals as  Record<string, any>` and
include `// deno-lint-ignore no-explicit-any` above it.

Only include a reference to `globals` and `const g` if the tests need
to alter global objects/values for the purposes of mocking them.

For example, the following uses the `const g` and then deletes the
global objects from `g` and assigns mock objects to `g`. Then
in the finally statement, it reassigns the original values
to `global`.

```ts
import { test } from "@bearz/testing";
import { equal } from "@bearz/assert";
import { gid } from "./gid.ts";
import { globals } from "./globals.ts";

// deno-lint-ignore no-explicit-any
const g = globals as Record<string, any>;

test("fs::gid returns number when Deno.gid exists", () => {
    const { Deno: od, process: proc, require: req  } = globals;
    delete g["Deno"];
    delete g["process"];
    delete g["require"];
    try {
        g.Deno = {
            gid: () => 1000
        };
        equal(gid(), 1000);
    } finally {
        globals.Deno = od;
        globals.process = proc;
        globals.require = req;
    }
});
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
