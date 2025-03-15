import { test } from "@bearz/testing";
import { equal, throws, rejects } from "@bearz/assert";
import { link, linkSync } from "./link.ts";
import { join } from "@bearz/path";
import { exec, output } from "./_testutils.ts";

const testData = join(import.meta.dirname!, "test-data");

test("fs::link creates a hard link to an existing file", async () => {
    await exec("mkdir", ["-p", testData]);

    const sourcePath = join(testData, "source1.txt");
    const linkPath = join(testData, "link1.txt");
    const content = "test content";

    try {
        await exec("bash", ["-c", `echo "${content}" > ${sourcePath}`]);
        await link(sourcePath, linkPath);
        
        const o = await output("cat", [linkPath]);
        const linkedContent = o.stdout.trim();
        equal(linkedContent, content);
    } finally {
        await exec("rm", ["-f", sourcePath, linkPath]);
    }
});

test("fs::link throws when source file doesn't exist", async () => {
    await exec("mkdir", ["-p", testData]);
    
    const sourcePath = join(testData, "nonexistent.txt");
    const linkPath = join(testData, "link.txt");
    
    try {
        await rejects(
            async () => await link(sourcePath, linkPath),
            Error
        );
    } finally {
        await exec("rm", ["-f", sourcePath, linkPath]);
    }
});

test("fs::linkSync creates a hard link to an existing file", async () => {
    await exec("mkdir", ["-p", testData]);

    const sourcePath = join(testData, "source2.txt");
    const linkPath = join(testData, "link2.txt");
    const content = "test content";

    try {
        await exec("bash", ["-c", `echo "${content}" > ${sourcePath}`]);
        linkSync(sourcePath, linkPath);
        
        const o = await output("cat", [linkPath]);
        const linkedContent = o.stdout.trim();
        equal(linkedContent, content);
    } finally {
        await exec("rm", ["-f", sourcePath, linkPath]);
    }
});

test("fs::linkSync throws when source file doesn't exist", async () => {
    await exec("mkdir", ["-p", testData]);

    const sourcePath = join(testData, "nonexistent2.txt");
    const linkPath = join(testData, "link2.txt");
    
    try {
        throws(
            () => linkSync(sourcePath, linkPath),
            Error
        );
    } finally {
        await exec("rm", ["-f", sourcePath, linkPath]);
    }
});