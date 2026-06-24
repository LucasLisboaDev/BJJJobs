import { beforeEach } from "vitest";
import "./helpers/mocks";
import { resetDatabase } from "./helpers/db";
import { clearEmailMocks } from "./helpers/mocks";

beforeEach(async () => {
  await resetDatabase();
  clearEmailMocks();
});
