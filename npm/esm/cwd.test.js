import "./_dnt.test_polyfills.js";
import { test } from "@bearz/testing";
import { ok } from "@bearz/assert";
import { cwd } from "./cwd.js";
test("fs::cwd is not empty", () => {
    ok(cwd() !== "");
});
