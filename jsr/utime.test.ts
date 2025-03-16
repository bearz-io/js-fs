import { test } from "@bearz/testing";
import { equal, rejects, throws } from "@bearz/assert";
import { utime, utimeSync } from "./utime.ts";
import { globals } from "./globals.ts";
import { join } from "@bearz/path";
import { exec, output } from "./_testutils.ts";

// deno-lint-ignore no-explicit-any
const g = globals as Record<string, any>;

const testData = join(import.meta.dirname!, "test-data");

test("fs::utime changes access and modification times", async () => {
    await exec("mkdir", ["-p", testData]);
    const testFile = join(testData, "utime-test.txt");
    const newAtime = new Date(2023, 0, 1);
    const newMtime = new Date(2023, 0, 2);

    try {
        await exec("touch", [testFile]);
        await utime(testFile, newAtime, newMtime);
        
        const stats = await output("stat", ["-c", "%X %Y", testFile]);
        const [atime, mtime] = stats.stdout.trim().split(" ");
        equal(new Date(Number.parseInt(atime) * 1000).getFullYear(), 2023);
        equal(new Date(Number.parseInt(mtime) * 1000).getFullYear(), 2023);
    } finally {
        await exec("rm", ["-f", testFile]);
    }
});

test("fs::utimeSync changes access and modification times synchronously", () => {
    const { Deno: od } = globals;
    delete g["Deno"];
    
    try {
        let called = false;
        g.Deno = {
            utimeSync: (_path: string, _atime: Date, _mtime: Date) => {
                called = true;
            }
        };
        
        utimeSync("test.txt", new Date(), new Date());
        equal(called, true);
    } finally {
        globals.Deno = od;
    }
});

test("fs::utime throws when neither Deno nor Node.js fs is available", async () => {
    const { Deno: od, process: proc, require: req } = globals;
    delete g["Deno"];
    delete g["process"];
    delete g["require"];
    
    try {
        await rejects(
            async () => await utime("test.txt", new Date(), new Date()),
            Error,
            "No suitable file system module found."
        );
    } finally {
        globals.Deno = od;
        globals.process = proc;
        globals.require = req;
    }
});

test("fs::utimeSync throws when neither Deno nor Node.js fs is available", () => {
    const { Deno: od, process: proc, require: req } = globals;
    delete g["Deno"];
    delete g["process"];
    delete g["require"];
    
    try {
        throws(
            () => utimeSync("test.txt", new Date(), new Date()),
            Error,
            "No suitable file system module found."
        );
    } finally {
        globals.Deno = od;
        globals.process = proc;
        globals.require = req;
    }
});