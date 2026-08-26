import os from "node:os";

// Node 24 can fail to resolve the Windows account name for tsx's temporary
// directory. The value is only used for that directory name.
os.userInfo = () => ({ username: "local" });

const { tsImport } = await import("tsx/esm/api");

const { adminCreatePromise } = await tsImport("./create-admin.ts", import.meta.url);

await adminCreatePromise;
