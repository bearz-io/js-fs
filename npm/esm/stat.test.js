import "./_dnt.test_polyfills.js";
import { test } from "@bearz/testing";
import { equal, ok } from "@bearz/assert";
import { stat, statSync } from "./stat.js";
import { join } from "@bearz/path";
import { exec } from "./_testutils.js";
import { globals } from "./globals.js";
// deno-lint-ignore no-explicit-any
const g = globals;
const testData = join(import.meta.dirname, "test-data", "stat");
test("fs::stat gets file information for a file", async () => {
    await exec("mkdir", ["-p", testData]);
    const filePath = join(testData, "test.txt");
    const content = "test content";
    try {
        await exec("bash", ["-c", `echo "${content}" > ${filePath}`]);
        const info = await stat(filePath);
        ok(info.isFile);
        equal(info.name, "test.txt");
        equal(info.path, filePath);
        ok(info.size > 0);
        ok(!info.isDirectory);
        ok(!info.isSymlink);
    } finally {
        await exec("rm", ["-rf", testData]);
    }
});
test("fs::stat gets file information for a directory", async () => {
    await exec("mkdir", ["-p", testData]);
    try {
        const info = await stat(testData);
        ok(info.isDirectory);
        ok(!info.isFile);
        ok(!info.isSymlink);
        equal(info.name, "stat");
    } finally {
        await exec("rm", ["-rf", testData]);
    }
});
test("fs::stat works with URL paths", async () => {
    await exec("mkdir", ["-p", testData]);
    const filePath = join(testData, "url-test.txt");
    const fileUrl = new URL(`file://${filePath}`);
    try {
        await exec("bash", ["-c", `echo "url test" > ${filePath}`]);
        const info = await stat(fileUrl);
        ok(info.isFile);
        equal(info.name, "url-test.txt");
        equal(info.path, fileUrl.toString());
    } finally {
        await exec("rm", ["-rf", testData]);
    }
});
test("fs::statSync gets file information synchronously", () => {
    const { Deno: od } = globals;
    delete g["Deno"];
    try {
        g.Deno = {
            statSync: () => ({
                isFile: true,
                isDirectory: false,
                isSymlink: false,
                size: 100,
                birthtime: new Date(),
                mtime: new Date(),
                atime: new Date(),
                mode: 0o666,
                uid: 1000,
                gid: 1000,
                dev: 0,
                ino: 0,
                nlink: 1,
                rdev: 0,
                blksize: 4096,
                blocks: 1,
                isBlockDevice: false,
                isCharDevice: false,
                isSocket: false,
                isFifo: false,
            }),
        };
        const info = statSync("test.txt");
        ok(info.isFile);
        equal(info.name, "test.txt");
        equal(info.path, "test.txt");
        equal(info.size, 100);
    } finally {
        globals.Deno = od;
    }
});
