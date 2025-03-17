import { test } from "@bearz/testing";
import { ok } from "@bearz/assert";
import { cwd } from "./cwd.ts";

test("fs::cwd is not empty", () => {
    ok(cwd() !== "");
});
