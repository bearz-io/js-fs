import "./_dnt.test_polyfills.js";
import { test } from "@bearz/testing";
import { equal, notEqual } from "@bearz/assert";
import { chmod, chmodSync } from "./chmod.js";
import { join } from "@bearz/path";
import { globals, WIN } from "./globals.js";
import { exec, output } from "./_testutils.js";
const testFile = join(import.meta.dirname, "chmod_test.txt");
test("fs::chmod changes permissions async", { skip: WIN }, async () => {
    await exec("touch", [testFile]);
    try {
        await exec("chmod", ["644", testFile]);
        await chmod(testFile, 0o755);
        const formatFlag = globals.process?.platform === "darwin" ? "-f" : "-c";
        const o = await output("stat", [formatFlag, "%a", testFile]);
        const mode = parseInt(o.stdout.trim(), 8);
        notEqual(mode, Number.NaN);
        // 0o755 in octal = 493 in decimal
        equal(mode & 0o777, 0o755);
    } finally {
        await exec("rm", [testFile]);
    }
});
test("fs::chmodSync changes permissions sync", async () => {
    await exec("touch", [testFile]);
    try {
        await exec("chmod", ["644", testFile]);
        chmodSync(testFile, 0o755);
        const formatFlag = globals.process?.platform === "darwin" ? "-f" : "-c";
        const o = await output("stat", [formatFlag, "%a", testFile]);
        const mode = parseInt(o.stdout.trim(), 8);
        notEqual(mode, Number.NaN);
        // 0o755 in octal = 493 in decimal
        equal(mode & 0o777, 0o755);
    } finally {
        await exec("rm", [testFile]);
    }
});
