import assert from "node:assert/strict";
import { spawn } from "node:child_process";

const port = process.env.SMOKE_PORT ?? "3210";
const baseUrl = `http://127.0.0.1:${port}`;
const nextBin = "node_modules/next/dist/bin/next";
const server = spawn(process.execPath, [nextBin, "start", "-p", port], {
  env: { ...process.env, NODE_ENV: "production" },
  stdio: "inherit",
});

async function waitForServer() {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${baseUrl}/`);
      if (response.ok) return;
    } catch {
      // The server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error("Smoke server tidak siap dalam 30 detik.");
}

async function checkRoute(path, expectedStatus = 200) {
  const response = await fetch(`${baseUrl}${path}`, { redirect: "manual" });
  assert.equal(response.status, expectedStatus, `${path} mengembalikan ${response.status}`);
  return response;
}

try {
  await waitForServer();
  for (const path of ["/", "/projects", "/cv", "/admin/login", "/robots.txt", "/sitemap.xml", "/projects/luncur"]) {
    await checkRoute(path);
  }

  const protectedResponse = await checkRoute("/admin/projects", 307);
  assert.equal(protectedResponse.headers.get("location"), "/admin/login");

  const projectHtml = await (await fetch(`${baseUrl}/projects/luncur`)).text();
  assert.match(projectHtml, /<title>Luncur \| Shuriza<\/title>/);
  assert.doesNotMatch(projectHtml, /Luncur \| Shuriza \| Shuriza/);

  console.log("Route smoke test passed.");
} finally {
  server.kill("SIGTERM");
}
