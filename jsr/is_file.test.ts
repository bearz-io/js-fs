import { test } from "@bearz/testing";
import { equal } from "@bearz/assert";
import { isFile, isFileSync } from "./is_file.ts";
import { join } from "@bearz/path";
import { exec } from "./_testutils.ts";

const testData = join(import.meta.dirname!, "test-data");

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
    await exec("mkdir", ["-p", testData]);
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
    await exec("mkdir", ["-p", testData]);
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
    await exec("mkdir", ["-p", testData]);
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