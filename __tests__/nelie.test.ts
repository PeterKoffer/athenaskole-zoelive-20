import fs from "fs";
import crypto from "crypto";
import { NELIE_LOCK } from "@/nelie.lock";

function sha256(path: string) {
  return crypto.createHash("sha256").update(fs.readFileSync(path)).digest("hex");
}

test("NELIE is locked", () => {
  const img = "public/nelie.png";
  expect(fs.existsSync(img)).toBe(true);
  const h = sha256(img);
  expect(h).toBe(NELIE_LOCK.imageSha256);
});