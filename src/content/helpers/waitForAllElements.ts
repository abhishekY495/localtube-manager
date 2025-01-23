import { areElementsLoaded } from "./areAllElementsLoaded";

// Helper to wait for all elements
export function waitForAllElements(
  selectors: string[],
  timeout: number = 6000
): Promise<boolean> {
  console.log("🔍 Waiting for all elements to load...");

  return new Promise((resolve) => {
    // First check if elements are already loaded
    if (areElementsLoaded(selectors)) {
      console.log("✅ All elements already loaded");
      resolve(true);
      return;
    }

    // Set timeout to prevent infinite waiting
    const timeoutId = setTimeout(() => {
      if (observer) {
        console.log(
          `⚠️ Timeout after ${timeout}ms waiting for elements:`,
          selectors
        );
        observer.disconnect();
        resolve(false);
      }
    }, timeout);

    // If not, observe DOM changes
    const observer = new MutationObserver(() => {
      if (areElementsLoaded(selectors)) {
        console.log("✅ All elements now loaded");
        clearTimeout(timeoutId);
        observer.disconnect();
        resolve(true);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  });
}
