import { fromFileUrl } from "@bearz/path";

export function toPathString(
    pathUrl: string | URL,
): string {
    return pathUrl instanceof URL ? fromFileUrl(pathUrl) : pathUrl;
}
