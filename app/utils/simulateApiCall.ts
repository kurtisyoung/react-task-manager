const rateLimitInterval = 1000; // Minimum interval (ms) between API calls

export const simulateApiCall = (
  action: string,
  data?: any,
  lastApiCallTime: number = 0
) => {
  const now = Date.now();
  if (now - lastApiCallTime < rateLimitInterval) {
    return Promise.reject(
      new Error(
        "Rate limit exceeded. Please wait before making another request."
      )
    );
  }
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ action, data, status: "success", lastApiCallTime: now });
    }, 500);
  });
};
