import { test } from "@bearz/testing";
import { equal, throws, rejects } from "@bearz/assert";
import { writeTextFile, writeTextFileSync } from "./write_text_file.ts";
import { join } from "@bearz/path";
import { exec, output } from "./_testutils.ts";

const testData = join(import.meta.dirname!, "test-data");

test("fs::writeTextFile writes text content to a file", async () => {
    await exec("mkdir", ["-p", testData]);
    const filePath = join(testData, "test1.txt");
    const content = "Hello World!";

    try {
        await writeTextFile(filePath, content);
        const o = await output("cat", [filePath]);
        equal(o.stdout.trim(), content);
    } finally {
        await exec("rm", ["-f", filePath]);
    }
});

test("fs::writeTextFile appends text when append option is true", async () => {
    await exec("mkdir", ["-p", testData]);
    const filePath = join(testData, "test2.txt");
    const content1 = "First line\n";
    const content2 = "Second line";

    try {
        await writeTextFile(filePath, content1);
        await writeTextFile(filePath, content2, { append: true });
        const o = await output("cat", [filePath]);
        equal(o.stdout.trim(), "First line\nSecond line");
    } finally {
        await exec("rm", ["-f", filePath]);
    }
});

test("fs::writeTextFile handles aborted signal", async () => {
    const controller = new AbortController();
    controller.abort();
    
    await rejects(
        () => writeTextFile("test.txt", "content", { signal: controller.signal }),
        Error,
    );
});

test("fs::writeTextFileSync writes text content to a file", async () => {
    await exec("mkdir", ["-p", testData]);
    const filePath = join(testData, "test3.txt");
    const content = "Sync content";
    try {
        writeTextFileSync(filePath, content);
       
        const o = await output("cat", [filePath]);
        equal(o.stdout.trim(), content);
    } finally {
       
        await exec("rm", ["-rf", testData]);
    }

   
});

test("fs::writeTextFileSync handles aborted signal", () => {
    const controller = new AbortController();
    controller.abort();
    
    throws(
        () => writeTextFileSync("test.txt", "content", { signal: controller.signal }),
        Error
    );
});