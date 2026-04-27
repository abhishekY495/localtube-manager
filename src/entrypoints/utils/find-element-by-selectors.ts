type FindElementBySelectorsOptions = {
  root?: ParentNode;
  maxAttempts?: number;
  retryDelayMs?: number;
};

const DEFAULT_MAX_ATTEMPTS = 3;
const DEFAULT_RETRY_DELAY_MS = 500;

const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

export const findElementBySelectors = async (
  selectors: readonly string[],
  {
    root = document,
    maxAttempts = DEFAULT_MAX_ATTEMPTS,
    retryDelayMs = DEFAULT_RETRY_DELAY_MS,
  }: FindElementBySelectorsOptions = {},
): Promise<Element | null> => {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    let currentElement: ParentNode = root;
    let foundAllElements = true;

    for (const selector of selectors) {
      const element = currentElement.querySelector(selector);

      if (!element) {
        foundAllElements = false;
        break;
      }

      currentElement = element;
    }

    if (foundAllElements) {
      return currentElement as Element;
    }

    if (attempt < maxAttempts) {
      await wait(retryDelayMs);
    }
  }

  return null;
};
