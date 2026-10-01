import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "restaurant_admin_session";

function createExpectedToken() {
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!password || !secret) {
    return null;
  }

  return createHmac("sha256", secret)
    .update(`admin:${password}`)
    .digest("hex");
}

export async function isAdminAuthenticated() {
  const expectedToken = createExpectedToken();

  if (!expectedToken) {
    return false;
  }

  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!sessionToken) {
    return false;
  }

  const provided = Buffer.from(sessionToken);
  const expected = Buffer.from(expectedToken);

  return (
    provided.length === expected.length &&
    timingSafeEqual(provided, expected)
  );
}