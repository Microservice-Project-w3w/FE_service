import { vi } from "vitest";
import { JSDOM } from "jsdom";

// Node 26 also exposes localStorage; use the browser environment's storage here.
const storageWindow = new JSDOM("", { url: "http://localhost:5173" }).window;
vi.stubGlobal("localStorage", storageWindow.localStorage);
vi.stubGlobal("sessionStorage", storageWindow.sessionStorage);
