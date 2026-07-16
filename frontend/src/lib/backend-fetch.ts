import https from "node:https";

type BackendResponse = { status: number; body: string };

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isBackendNetworkError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  const code = (err as NodeJS.ErrnoException)?.code;
  return (
    code === "EAI_AGAIN" ||
    code === "ENOTFOUND" ||
    code === "ETIMEDOUT" ||
    code === "ECONNRESET" ||
    code === "ECONNREFUSED" ||
    msg.includes("timed out") ||
    msg.includes("fetch failed")
  );
}

function postOnce(
  url: string,
  body: string,
  headers: Record<string, string>,
  timeoutMs: number,
): Promise<BackendResponse> {
  const u = new URL(url);

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: u.hostname,
        port: u.port || 443,
        path: `${u.pathname}${u.search}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body),
          ...headers,
        },
        timeout: timeoutMs,
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (chunk) => chunks.push(chunk as Buffer));
        res.on("end", () => {
          resolve({
            status: res.statusCode ?? 502,
            body: Buffer.concat(chunks).toString("utf8"),
          });
        });
      },
    );

    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy(new Error("backend request timed out"));
    });
    req.write(body);
    req.end();
  });
}

/** POST JSON to the backend with retry + longer timeout than Node fetch defaults. */
export async function postBackendJson(
  url: string,
  payload: unknown,
  headers: Record<string, string>,
  timeoutMs = 45_000,
): Promise<BackendResponse> {
  const body = JSON.stringify(payload);
  let lastErr: unknown;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      return await postOnce(url, body, headers, timeoutMs);
    } catch (err) {
      lastErr = err;
      if (attempt === 0 && isBackendNetworkError(err)) {
        await sleep(1500);
        continue;
      }
      throw err;
    }
  }
  throw lastErr;
}
