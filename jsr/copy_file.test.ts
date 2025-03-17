import { test } from "@bearz/testing";
import { equal, rejects, throws } from "@bearz/assert";
import { copyFile, copyFileSync } from "./copy_file.ts";
import { join } from "@bearz/path";
import { exec } from "./_testutils.ts";
import { output } from "./_testutils.ts";

const testDir = join(import.meta.dirname!, "test-data", "cp");
const sourceFile1 = join(testDir, "source1.txt");
const destFile1 = join(testDir, "dest1.txt");
const sourceFile2 = join(testDir, "source2.txt");
const destFile2 = join(testDir, "dest2.txt");
const content = "test content";

test("fs::copyFile copies file asynchronously", async () => {
    try {
        await exec("mkdir", ["-p", testDir]);
        await exec("bash", ["-c", `echo "${content}" > ${sourceFile1}`]);
        await copyFile(sourceFile1, destFile1);

        const o = await output("cat", [destFile1]);
        const copied = o.stdout.trim();
        equal(copied, content);
    } finally {
        await exec("rm", ["-rf", sourceFile1, destFile1]);
    }
});

test("fs::copyFile throws when source doesn't exist", () => {
    rejects(async () => await copyFile("nonexistent.txt", destFile1));
});

test("fs::copyFileSync copies file synchronously", async () => {
    try {
        await exec("mkdir", ["-p", testDir]);
        await exec("bash", ["-c", `echo "${content}" > ${sourceFile2}`]);
        copyFileSync(sourceFile2, destFile2);

        const o = await output("cat", [destFile2]);
        const copied = o.stdout.trim();
        equal(copied, content);
    } finally {
        await exec("rm", ["-f", sourceFile2, destFile2]);
    }
});

test("fs::copyFileSync throws when source doesn't exist", () => {
    throws(
        () => copyFileSync("nonexistent.txt", destFile2),
        Error,
    );
});
