import { test } from "@bearz/testing";
import { ok } from "@bearz/assert";
import { gid } from "./gid.ts";
import { WIN } from "./globals.ts";

test("fs::gid returns number when not on windows", { skip: WIN }, () => {
    const g = gid();
    ok(g !== undefined && g !== null && g > -1);
});
