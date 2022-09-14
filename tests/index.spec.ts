import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as aws from "@pulumi/aws";
import {
  beforeEach,
  describe,
  expect,
  Mock,
  Mocked,
  MockedFunction,
  MockInstance,
  test,
  vi,
} from "vitest";
import { startBot } from "../bot";

vi.mock("../bot", () => ({
  startBot: vi.fn(() => ({
    getLogger: vi.fn(() => ({ logger: { log: vi.fn() } })),
  })),
}));

describe("Main - Index", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
    vi.resetModules();
  });

  test("should export startBot", async () => {
    expect(startBot).toBeTypeOf("function");
    expect(startBot).toBeCalledTimes(0);
  });
});
