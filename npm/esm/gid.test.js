import "./_dnt.test_polyfills.js";
import { test } from "@bearz/testing";
import { ok } from "@bearz/assert";
import { gid } from "./gid.js";
import { WIN } from "./globals.js";
test("fs::gid returns number when not on windows", { skip: WIN }, () => {
    const g = gid();
    ok(g !== undefined && g !== null && g > -1);
});
