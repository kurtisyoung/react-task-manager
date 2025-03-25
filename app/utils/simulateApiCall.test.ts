import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { simulateApiCall, resetLastApiCallTime } from "./simulateApiCall";

interface ApiResponse {
  action: string;
  data?: any;
  status: "success";
}

let now = 0;

describe("simulateApiCall", () => {
  beforeEach(() => {
    now = 1000; // Start at a safe time
    vi.useFakeTimers();
    vi.spyOn(Date, "now").mockImplementation(() => now);
    resetLastApiCallTime(); // Reset the rate limit state
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
    });
  });

  it("handles calls without data", async () => {
    const action = "test";
    now += 1100; // Advance past rate limit

    const promise = simulateApiCall(action);
    vi.advanceTimersByTime(500);
    const result = (await promise) as ApiResponse;
    expect(result).toEqual({
      action,
      data: undefined,
      status: "success",
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
    const secondPromise = simulateApiCall(action, data);
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
    const secondPromise = simulateApiCall(action, data);
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
    await firstPromise;

    // Advance time past rate limit
    now += 1100;

    // Second call
    const secondPromise = simulateApiCall(action);
    vi.advanceTimersByTime(500);
    await secondPromise;

    // Verify that rate limiting is working
    const thirdPromise = simulateApiCall(action);
    await expect(thirdPromise).rejects.toThrow(
      "Rate limit exceeded. Please wait before making another request."
    );
  });
});
