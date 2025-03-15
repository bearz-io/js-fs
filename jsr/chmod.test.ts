import { test } from "@bearz/testing";
import { throws, rejects, equal, notEqual } from "@bearz/assert";
import { chmod, chmodSync } from "./chmod.ts";
import { join } from "@bearz/path"
import { globals, WIN } from "./globals.ts";
import { exec, output } from "./_testutils.ts";

const testFile = join(import.meta.dirname!, "chmod_test.txt");
// deno-lint-ignore no-explicit-any
const g = globals as Record<string, any>;

test("fs::chmod throws when no suitable fs module found", async () => {
    // Mock environment where no fs modules are available
    const { Deno: od, process: proc, require: req  } = globals;
    delete g["Deno"];
    delete g["process"];
    delete g["require"];
    
    await rejects(
        async () => await chmod(testFile, 0o755),
        Error,
        "No suitable file system module found."
    );

    globals.Deno = od;
    globals.process = proc;
    globals.require = req;
});

test("fs::chmodSync throws when no suitable fs module found", () => {
    // Mock environment where no fs modules are available  
    const { Deno: od, process: proc, require: req  } = globals;
    delete g["Deno"];
    delete g["process"];
    delete g["require"];

    throws(
        () => chmodSync(testFile, 0o755),
        Error,
        "No suitable file system module found."
    );

    globals.Deno = od;
    globals.process = proc;
    globals.require = req;
});

test("fs::chmod changes permissions async", { skip: WIN }, async () => {
    await exec("touch", [testFile]);  

    try {
        await exec("chmod", ["644", testFile]);
        await chmod(testFile, 0o755);
        const o = await output("stat", ["-c", "%a", testFile]);
        const mode = parseInt(o.stdout.trim(), 8);
        notEqual(mode, Number.NaN);
        // 0o755 in octal = 493 in decimal
        equal(mode! & 0o777, 0o755);
    } finally {
        await exec("rm", [testFile]);
    }
});


test("fs::chmodSync changes permissions sync", async () => {
    await exec("touch", [testFile]);

    try 
    {
        await exec("chmod", ["644", testFile]);
        chmodSync(testFile, 0o755);
        const o = await output("stat", ["-c", "%a", testFile]);
        const mode = parseInt(o.stdout.trim(), 8);
        notEqual(mode, Number.NaN);
        // 0o755 in octal = 493 in decimal
        equal(mode! & 0o777, 0o755);

    } finally {
        await exec("rm", [testFile]);
    }
});


