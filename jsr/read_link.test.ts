import { test } from "@bearz/testing";
import { equal } from "@bearz/assert";
import { readLink, readLinkSync } from "./read_link.ts";
import { join } from "@bearz/path";
import { exec } from "./_testutils.ts";

const testData = join(import.meta.dirname!, "test-data", "read_link");

test("fs::readLink reads target of symbolic link", async () => {
    await exec("mkdir", ["-p", testData]);
    const sourcePath = join(testData, "source2.txt");
    const linkPath = join(testData, "link2.txt");
    const content = "test content";

    try {
        await exec("bash", ["-c", `echo "${content}" > ${sourcePath}`]);
        await exec("ln", ["-s", sourcePath, linkPath]);

        const target = await readLink(linkPath);
        equal(target, sourcePath);
    } finally {
        await exec("rm", ["-f", sourcePath, linkPath]);
    }
});

test("fs::readLinkSync reads target of symbolic link", async () => {
    await exec("mkdir", ["-p", testData]);
    const sourcePath = join(testData, "source3.txt");
    const linkPath = join(testData, "link3.txt");
    const content = "test content";

    try {
        await exec("bash", ["-c", `echo "${content}" > ${sourcePath}`]);
        await exec("ln", ["-s", sourcePath, linkPath]);

        const target = readLinkSync(linkPath);
        equal(target, sourcePath);
    } finally {
        await exec("rm", ["-f", sourcePath, linkPath]);
    }
});
