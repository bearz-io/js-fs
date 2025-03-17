import { test } from "@bearz/testing";
import { equal, ok, rejects, throws } from "@bearz/assert";
import { ext, open, openSync } from "./open.ts";
import { join } from "@bearz/path";
import { exec, execSync, output, outputSync } from "./_testutils.ts";
import { globals } from "./globals.ts";

const testData = join(import.meta.dirname!, "test-data");

test("fs::open opens file with read access", async () => {
    await exec("mkdir", ["-p", testData]);
    const filePath = join(testData, "read1.txt");
    const content = "test content";

    try {
        await exec("bash", ["-c", `echo "${content}" > ${filePath}`]);
        using file = await open(filePath, { read: true });
        ok(file.supports.includes("read"));

        const buffer = new Uint8Array(100);
        const bytesRead = await file.read(buffer);
        ok(bytesRead !== null);
        const text = new TextDecoder().decode(buffer.subarray(0, bytesRead!));
        equal(text.trim(), content);
    } finally {
        await exec("rm", ["-f", filePath]);
    }
});

test("fs::open opens file with write access", async () => {
    await exec("mkdir", ["-p", testData]);
    const filePath = join(testData, "write.txt");
    const content = "test write content";

    try {
        using file = await open(filePath, { write: true, create: true });
        ok(file.supports.includes("write"));

        const buffer = new TextEncoder().encode(content);
        const bytesWritten = await file.write(buffer);
        equal(bytesWritten, buffer.length);

        const fileContent = await output("cat", [filePath]);
        equal(fileContent.stdout.trim(), content);
    } finally {
        await exec("rm", ["-f", filePath]);
    }
});

test("fs::openSync opens file with read access", () => {
    execSync("mkdir", ["-p", testData]);
    const filePath = join(testData, "read-sync.txt");
    const content = "test sync content";

    try {
        execSync("bash", ["-c", `echo "${content}" > ${filePath}`]);
        using file = openSync(filePath, { read: true });
        ok(file.supports.includes("read"));

        const buffer = new Uint8Array(100);
        const bytesRead = file.readSync(buffer);
        ok(bytesRead !== null);
        const text = new TextDecoder().decode(buffer.subarray(0, bytesRead!));
        equal(text.trim(), content);
    } finally {
        execSync("rm", ["-f", filePath]);
    }
});

test("fs::openSync opens file with write access", () => {
    execSync("mkdir", ["-p", testData]);
    const filePath = join(testData, "write-sync.txt");
    const content = "test sync write content";

    try {
        using file = openSync(filePath, { write: true, create: true });
        ok(file.supports.includes("write"));

        const buffer = new TextEncoder().encode(content);
        const bytesWritten = file.writeSync(buffer);
        equal(bytesWritten, buffer.length);

        const fileContent = outputSync("cat", [filePath]).stdout;
        equal(fileContent.trim(), content);
    } finally {
        execSync("rm", ["-f", filePath]);
    }
});

test("fs::open throws error when file doesn't exist", async () => {
    const nonExistentPath = join(testData, "non-existent.txt");
    await rejects(() => open(nonExistentPath, { read: true }));
});

test("fs::openSync throws error when file doesn't exist", () => {
    const nonExistentPath = join(testData, "non-existent.txt");
    throws(() => openSync(nonExistentPath, { read: true }));
});

test("fs::open file supports lock operations", {
    skip: globals.Deno === undefined && !ext.lockSupported,
}, async () => {
    await exec("mkdir", ["-p", testData]);
    const filePath = join(testData, "lock.txt");

    try {
        using file = await open(filePath, { write: true, create: true });
        ok(file.supports.includes("lock"));

        await file.lock();
        await file.unlock();
    } finally {
        await exec("rm", ["-f", filePath]);
    }
});

test("fs::open file supports seek operations", {
    skip: globals.Deno === undefined && !ext.seekSupported,
}, async () => {
    await exec("mkdir", ["-p", testData]);
    const filePath = join(testData, "seek.txt");
    const content = "test seek content";

    try {
        await exec("bash", ["-c", `echo "${content}" > ${filePath}`]);
        using file = await open(filePath, { read: true });
        ok(file.supports.includes("seek"));

        await file.seek(5, "start");
        const buffer = new Uint8Array(100);
        const bytesRead = await file.read(buffer);
        ok(bytesRead !== null);
        const text = new TextDecoder().decode(buffer.subarray(0, bytesRead!));
        equal(text.trim(), content.slice(5));
    } finally {
        await exec("rm", ["-f", filePath]);
    }
});

test("fs::open file supports stat operations", async () => {
    await exec("mkdir", ["-p", testData]);
    const filePath = join(testData, "stat.txt");
    const content = "test stat content";

    try {
        await exec("bash", ["-c", `echo "${content}" > ${filePath}`]);
        using file = await open(filePath, { read: true });
        const stat = await file.stat();

        ok(stat.isFile);
        equal(stat.size, content.length + 1); // +1 for newline
        ok(stat.mtime instanceof Date);
        ok(stat.atime instanceof Date);
    } finally {
        await exec("rm", ["-f", filePath]);
    }
});
