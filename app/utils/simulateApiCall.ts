// --- Rate Limiting & API Simulation ---
// A module-level variable to store the timestamp of the last API call.
let lastApiCallTime = 0;
const rateLimitInterval = 1000; // Minimum interval (ms) between API calls

// Simulate an API call with a delay and rate-limiting check
export const simulateApiCall = (action: string, data?: any) => {
  const now = Date.now();
  if (now - lastApiCallTime < rateLimitInterval) {
    return Promise.reject(
      new Error(
        "Rate limit exceeded. Please wait before making another request."
      )
    );
  }
  lastApiCallTime = now;
  return new Promise((resolve) => {
    // Simulate network latency of 500ms
    setTimeout(() => {
      resolve({ action, data, status: "success" });
    }, 500);
  });
};
