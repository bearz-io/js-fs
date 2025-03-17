import { test } from "@bearz/testing";
import { equal } from "@bearz/assert";
import { rename, renameSync } from "./rename.ts";
import { join } from "@bearz/path";
import { exec, output } from "./_testutils.ts";

const testData = join(import.meta.dirname!, "test-data", "rename-test");

test("fs::rename renames a file", async () => {
    await exec("mkdir", ["-p", testData]);
    const oldPath = join(testData, "old.txt");
    const newPath = join(testData, "new.txt");
    const content = "test content";

    try {
        await exec("bash", ["-c", `echo "${content}" > ${oldPath}`]);
        await rename(oldPath, newPath);

        const o = await output("cat", [newPath]);
        const renamedContent = o.stdout.trim();
        equal(renamedContent, content);
    } finally {
        await exec("rm", ["-f", oldPath, newPath]);
    }
});

test("fs::renameSync renames a file", async () => {
    await exec("mkdir", ["-p", testData]);
    const oldPath = join(testData, "old-sync.txt");
    const newPath = join(testData, "new-sync.txt");
    const content = "test content sync";

    try {
        await exec("bash", ["-c", `echo "${content}" > ${oldPath}`]);
        renameSync(oldPath, newPath);

        const o = await output("cat", [newPath]);
        const renamedContent = o.stdout.trim();
        equal(renamedContent, content);
    } finally {
        await exec("rm", ["-f", oldPath, newPath]);
    }
});
