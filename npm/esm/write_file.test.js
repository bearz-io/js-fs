import "./_dnt.test_polyfills.js";
import { test } from "@bearz/testing";
import { equal, rejects } from "@bearz/assert";
import { writeFile, writeFileSync } from "./write_file.js";
import { join } from "@bearz/path";
import { exec, output } from "./_testutils.js";
import { readTextFile } from "./read_text_file.js";
const testData = join(import.meta.dirname, "test-data", "write_file");
test("fs::writeFile writes data to a file", async () => {
    await exec("mkdir", ["-p", testData]);
    const filePath = join(testData, "test.txt");
    const content = new TextEncoder().encode("test content");
    try {
        await writeFile(filePath, content);
        const o = await output("cat", [filePath]);
        equal(o.stdout.trim(), "test content");
    } finally {
        await exec("rm", ["-f", filePath]);
    }
});
test("fs::writeFile appends data when append option is true", async () => {
    await exec("mkdir", ["-p", testData]);
    const filePath = join(testData, "append.txt");
    const content1 = new TextEncoder().encode("first ");
    const content2 = new TextEncoder().encode("second");
    try {
        await writeFile(filePath, content1);
        await writeFile(filePath, content2, { append: true });
        const o = await output("cat", [filePath]);
        equal(o.stdout.trim(), "first second");
    } finally {
        await exec("rm", ["-f", filePath]);
    }
});
test("fs::writeFile handles ReadableStream input", async () => {
    await exec("mkdir", ["-p", testData]);
    const filePath = join(testData, "stream.txt");
    const content = "stream content";
    const stream = new ReadableStream({
        start(controller) {
            controller.enqueue(new TextEncoder().encode(content));
            controller.close();
        },
    });
    try {
        await writeFile(filePath, stream);
        const content2 = await readTextFile(filePath);
        equal(content2, content);
    } finally {
        await exec("rm", ["-f", filePath]);
    }
});
test("fs::writeFileSync writes data to a file synchronously", async () => {
    await exec("mkdir", ["-p", testData]);
    const filePath = join(testData, "sync.txt");
    const content = new TextEncoder().encode("sync content");
    try {
        writeFileSync(filePath, content);
        const result = await output("cat", [filePath]);
        equal(result.stdout.trim(), "sync content");
    } finally {
        await exec("rm", ["-f", filePath]);
    }
});
test("fs::writeFile handles abort signal", async () => {
    await exec("mkdir", ["-p", testData]);
    const filePath = join(testData, "abort.txt");
    const content = new TextEncoder().encode("abort content");
    const controller = new AbortController();
    try {
        controller.abort();
        await rejects(
            async () => await writeFile(filePath, content, { signal: controller.signal }),
            Error,
        );
    } finally {
        await exec("rm", ["-f", filePath]);
    }
});
