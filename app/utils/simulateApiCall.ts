let lastApiCallTime = 0;
const rateLimitInterval = 1000; // Minimum interval (ms) between API calls

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
    setTimeout(() => {
      resolve({ action, data, status: "success" });
    }, 500);
  });
};

// Export a reset function for testing purposes
export const resetLastApiCallTime = () => {
  lastApiCallTime = 0;
};
