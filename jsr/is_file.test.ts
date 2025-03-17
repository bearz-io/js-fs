import { test } from "@bearz/testing";
import { equal } from "@bearz/assert";
import { isFile, isFileSync } from "./is_file.ts";
import { join } from "@bearz/path";
import { exec } from "./_testutils.ts";
import { makeDir, makeDirSync } from "./make_dir.ts";

const testData = join(import.meta.dirname!, "test-data", "is_file");

test("fs::isFile returns true for existing file", async () => {
    await exec("mkdir", ["-p", testData]);
    const filePath = join(testData, "test.txt");

    try {
        await exec("bash", ["-c", `echo "test" > ${filePath}`]);
        const result = await isFile(filePath);
        equal(result, true);
    } finally {
        await exec("rm", ["-f", filePath]);
    }
});

test("fs::isFile returns false for directory", async () => {
    await makeDir(testData, { recursive: true });
    try {
        const result = await isFile(testData);
        equal(result, false);
    } finally {
        await exec("rm", ["-rf", testData]);
    }
});

test("fs::isFile returns false for non-existent path", async () => {
    const result = await isFile("non-existent-file.txt");
    equal(result, false);
});

test("fs::isFileSync returns true for existing file", async () => {
    await makeDirSync(testData, { recursive: true });
    const filePath = join(testData, "test.txt");

    try {
        await exec("bash", ["-c", `echo "test" > ${filePath}`]);
        const result = isFileSync(filePath);
        equal(result, true);
    } finally {
        await exec("rm", ["-f", filePath]);
    }
});

test("fs::isFileSync returns false for directory", async () => {
    makeDirSync(testData, { recursive: true });
    try {
        const result = isFileSync(testData);
        equal(result, false);
    } finally {
        await exec("rm", ["-rf", testData]);
    }
});

test("fs::isFileSync returns false for non-existent path", () => {
    const result = isFileSync("non-existent-file.txt");
    equal(result, false);
});
