import "./_dnt.test_polyfills.js";
import { test } from "@bearz/testing";
import { equal } from "@bearz/assert";
import { symlink, symlinkSync } from "./symlink.js";
import { join } from "@bearz/path";
import { exec, output } from "./_testutils.js";
const testData = join(import.meta.dirname, "test-data");
test("fs::symlink creates a symbolic link to a file", async () => {
    await exec("mkdir", ["-p", testData]);
    const sourcePath = join(testData, "source1.txt");
    const linkPath = join(testData, "link1.txt");
    const content = "test content";
    try {
        await exec("bash", ["-c", `echo "${content}" > ${sourcePath}`]);
        await symlink(sourcePath, linkPath);
        const o = await output("cat", [linkPath]);
        const linkedContent = o.stdout.trim();
        equal(linkedContent, content);
    } finally {
        await exec("rm", ["-f", sourcePath, linkPath]);
    }
});
test("fs::symlinkSync creates a symbolic link to a file", async () => {
    await exec("mkdir", ["-p", testData]);
    const sourcePath = join(testData, "source2.txt");
    const linkPath = join(testData, "link2.txt");
    const content = "test content sync";
    try {
        await exec("bash", ["-c", `echo "${content}" > ${sourcePath}`]);
        symlinkSync(sourcePath, linkPath);
        const o = await output("cat", [linkPath]);
        const linkedContent = o.stdout.trim();
        equal(linkedContent, content);
    } finally {
        await exec("rm", ["-f", sourcePath, linkPath]);
    }
});
