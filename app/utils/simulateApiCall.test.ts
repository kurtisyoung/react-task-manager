import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { simulateApiCall } from "./simulateApiCall";

interface ApiResponse {
  action: string;
  data?: any;
  status: "success";
  lastApiCallTime: number;
}

let now = 0;

describe("simulateApiCall", () => {
  beforeEach(() => {
    now = 1000; // Start at a safe time
    vi.useFakeTimers();
    vi.spyOn(Date, "now").mockImplementation(() => now);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("successfully resolves with correct data", async () => {
    const action = "test";
    const data = { foo: "bar" };

    const promise = simulateApiCall(action, data);
    vi.advanceTimersByTime(500);
    const result = (await promise) as ApiResponse;
    expect(result).toEqual({
      action,
      data,
      status: "success",
      lastApiCallTime: now,
    });
  });

  it("handles calls without data", async () => {
    const action = "test";

    const promise = simulateApiCall(action);
    vi.advanceTimersByTime(500);
    const result = (await promise) as ApiResponse;
    expect(result).toEqual({
      action,
      data: undefined,
      status: "success",
      lastApiCallTime: now,
    });
  });

  it("enforces rate limiting between calls", async () => {
    const action = "test";
    const data = { foo: "bar" };

    // First call should succeed
    const firstPromise = simulateApiCall(action, data);
    vi.advanceTimersByTime(500);
    const firstResult = (await firstPromise) as ApiResponse;
    expect(firstResult.status).toBe("success");

    // Second call within rate limit should fail
    const secondPromise = simulateApiCall(
      action,
      data,
      firstResult.lastApiCallTime
    );
    await expect(secondPromise).rejects.toThrow(
      "Rate limit exceeded. Please wait before making another request."
    );
  });

  it("allows calls after rate limit period", async () => {
    const action = "test";
    const data = { foo: "bar" };

    // First call
    const firstPromise = simulateApiCall(action, data);
    vi.advanceTimersByTime(500);
    const firstResult = (await firstPromise) as ApiResponse;
    expect(firstResult.status).toBe("success");

    // Advance time past rate limit
    now += 1100;

    // Second call should succeed after rate limit period
    const secondPromise = simulateApiCall(
      action,
      data,
      firstResult.lastApiCallTime
    );
    vi.advanceTimersByTime(500);
    const secondResult = (await secondPromise) as ApiResponse;
    expect(secondResult.status).toBe("success");
  });

  it("handles different data types", async () => {
    const action = "test";
    const testCases = [
      { data: null, expected: null },
      { data: undefined, expected: undefined },
      { data: 42, expected: 42 },
      { data: "string", expected: "string" },
      { data: { obj: "value" }, expected: { obj: "value" } },
      { data: [1, 2, 3], expected: [1, 2, 3] },
    ];

    for (const { data, expected } of testCases) {
      now += 1100; // Advance past rate limit for each call
      const promise = simulateApiCall(action, data);
      vi.advanceTimersByTime(500);
      const result = (await promise) as ApiResponse;
      expect(result.data).toEqual(expected);
    }
  });

  it("maintains consistent delay between calls", async () => {
    const action = "test";

    // First call
    const firstPromise = simulateApiCall(action);
    vi.advanceTimersByTime(500);
    const firstResult = (await firstPromise) as ApiResponse;

    // Advance time past rate limit
    now += 1100;

    // Second call
    const secondPromise = simulateApiCall(
      action,
      undefined,
      firstResult.lastApiCallTime
    );
    vi.advanceTimersByTime(500);
    const secondResult = (await secondPromise) as ApiResponse;

    // Verify that rate limiting is working
    const thirdPromise = simulateApiCall(
      action,
      undefined,
      secondResult.lastApiCallTime
    );
    await expect(thirdPromise).rejects.toThrow(
      "Rate limit exceeded. Please wait before making another request."
    );
  });
});
