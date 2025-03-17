import "./_dnt.test_polyfills.js";
import { test } from "@bearz/testing";
import { equal, ok } from "@bearz/assert";
import { join } from "@bearz/path";
import { exec } from "./_testutils.js";
import { lstat, lstatSync } from "./lstat.js";
const testData = join(import.meta.dirname, "test-data", "lstat");
test("fs::lstat returns file info for a file", async () => {
    await exec("mkdir", ["-p", testData]);
    const filePath = join(testData, "test.txt");
    const content = "test content";
    try {
        await exec("bash", ["-c", `echo "${content}" > ${filePath}`]);
        const info = await lstat(filePath);
        ok(info.isFile);
        equal(info.name, "test.txt");
        equal(info.path, filePath);
        ok(info.size > 0);
    } finally {
        await exec("rm", ["-f", filePath]);
    }
});
test("fs::lstat returns file info for a directory", async () => {
    await exec("mkdir", ["-p", testData]);
    try {
        const info = await lstat(testData);
        ok(info.isDirectory);
        ok(!info.isFile);
    } finally {
        await exec("rm", ["-rf", testData]);
    }
});
test("fs::lstatSync returns file info for a file", async () => {
    await exec("mkdir", ["-p", testData]);
    const filePath = join(testData, "test-sync.txt");
    const content = "test content";
    try {
        await exec("bash", ["-c", `echo "${content}" > ${filePath}`]);
        const info = lstatSync(filePath);
        ok(info.isFile);
        equal(info.name, "test-sync.txt");
        equal(info.path, filePath);
        ok(info.size > 0);
    } finally {
        await exec("rm", ["-f", filePath]);
    }
});
test("fs::lstat handles URL paths", async () => {
    await exec("mkdir", ["-p", testData]);
    const filePath = join(testData, "url-test.txt");
    const fileUrl = new URL(`file://${filePath}`);
    const content = "url test content";
    try {
        await exec("bash", ["-c", `echo "${content}" > ${filePath}`]);
        const info = await lstat(fileUrl);
        ok(info.isFile);
        equal(info.name, "url-test.txt");
        equal(info.path, fileUrl.toString());
    } finally {
        await exec("rm", ["-f", filePath]);
    }
});
test("fs::lstat throws error for non-existent path", async () => {
    const nonExistentPath = join(testData, "non-existent.txt");
    try {
        await lstat(nonExistentPath);
        ok(false, "Should have thrown error");
    } catch (error) {
        ok(error instanceof Error);
    }
});
