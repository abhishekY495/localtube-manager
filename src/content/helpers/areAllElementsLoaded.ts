export function areElementsLoaded(selectors: string[]): boolean {
  let currentElement: Element | Document = document;

  // Check each selector in sequence, ensuring proper nesting
  for (const selector of selectors) {
    const element: any = currentElement.querySelector(selector);
    if (!element) {
      console.log(`❌ Element not found: ${selector} inside`, currentElement);
      return false;
    }
    // Update currentElement to continue search within this element
    currentElement = element;
    console.log(`✅ Found ${selector} in correct nesting`);
  }

  return true;
}
