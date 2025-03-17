import "./_dnt.test_polyfills.js";
import { test } from "@bearz/testing";
import { equal } from "@bearz/assert";
import { utime, utimeSync } from "./utime.js";
import { globals } from "./globals.js";
import { join } from "@bearz/path";
import { exec, output } from "./_testutils.js";
// deno-lint-ignore no-explicit-any
const g = globals;
const testData = join(import.meta.dirname, "test-data");
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
            utimeSync: (_path, _atime, _mtime) => {
                called = true;
            },
        };
        utimeSync("test.txt", new Date(), new Date());
        equal(called, true);
    } finally {
        globals.Deno = od;
    }
});
