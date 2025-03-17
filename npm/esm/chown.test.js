import "./_dnt.test_polyfills.js";
import { test } from "@bearz/testing";
import { equal, notEqual } from "@bearz/assert";
import { chown, chownSync } from "./chown.js";
import { exec, output } from "./_testutils.js";
import { join } from "@bearz/path";
import { uid } from "./uid.js";
const testFile1 = join(import.meta.dirname, "chown_test.txt");
const testFile2 = join(import.meta.dirname, "chown_test2.txt");
const cu = uid();
test("chown::chown changes the owner async", { skip: (cu === null || cu !== 0) }, async () => {
    await exec("touch", [testFile2]);
    try {
        await exec("sudo", ["chown", "nobody:nogroup", testFile2]);
        await chown(testFile2, 1000, 1000);
        const o = await output("stat", ["-c", "%u:%g", testFile2]);
        const uid = parseInt(o.stdout.split(":")[0]);
        const gid = parseInt(o.stdout.split(":")[1]);
        console.log(o.stdout);
        notEqual(uid, Number.NaN);
        notEqual(gid, Number.NaN);
        // 1000 in decimal = 0o1750 in octal
        equal(uid, 1000);
        equal(gid, 1000);
    } finally {
        await exec("rm", ["-f", testFile2]);
    }
});
test("chown::chownSync changes the owner", { skip: (cu === null || cu !== 0) }, async () => {
    await exec("touch", [testFile1]);
    try {
        await exec("sudo", ["chown", "nobody:nogroup", testFile1]);
        chownSync(testFile1, 1000, 1000);
        const o = await output("stat", ["-c", "%u:%g", testFile1]);
        const uid = parseInt(o.stdout.split(":")[0]);
        const gid = parseInt(o.stdout.split(":")[1]);
        notEqual(uid, Number.NaN);
        notEqual(gid, Number.NaN);
        // 1000 in decimal = 0o1750 in octal
        equal(uid, 1000);
        equal(gid, 1000);
    } finally {
        await exec("rm", ["-f", testFile1]);
    }
});
