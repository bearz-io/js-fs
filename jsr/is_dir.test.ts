import { test } from "@bearz/testing";
import { equal } from "@bearz/assert";
import { isDir, isDirSync } from "./is_dir.ts";
import { join } from "@bearz/path";
import { exec } from "./_testutils.ts";

const testData = join(import.meta.dirname!, "test-data", "is_dir");

test("fs::isDir returns true for existing directory", async () => {
    await exec("mkdir", ["-p", testData]);
    try {
        const result = await isDir(testData);
        equal(result, true);
    } finally {
        await exec("rm", ["-rf", testData]);
    }
});

test("fs::isDir returns false for non-existent path", async () => {
    const nonExistentPath = join(testData, "non-existent");
    const result = await isDir(nonExistentPath);
    equal(result, false);
});

test("fs::isDir returns false for file", async () => {
    await exec("mkdir", ["-p", testData]);
    const filePath = join(testData, "test.txt");

    try {
        await exec("touch", [filePath]);
        const result = await isDir(filePath);
        equal(result, false);
    } finally {
        await exec("rm", ["-rf", testData]);
    }
});

test("fs::isDirSync returns true for existing directory", async () => {
    await exec("mkdir", ["-p", testData]);
    try {
        const result = isDirSync(testData);
        equal(result, true);
    } finally {
        await exec("rm", ["-rf", testData]);
    }
});

test("fs::isDirSync returns false for non-existent path", () => {
    const nonExistentPath = join(testData, "non-existent");
    const result = isDirSync(nonExistentPath);
    equal(result, false);
});

test("fs::isDirSync returns false for file", async () => {
    await exec("mkdir", ["-p", testData]);
    const filePath = join(testData, "test.txt");

    try {
        await exec("bash", ["-c", `echo "test" > ${filePath}`]);
        const result = isDirSync(filePath);
        equal(result, false);
    } finally {
        await exec("rm", ["-rf", testData]);
    }
});
