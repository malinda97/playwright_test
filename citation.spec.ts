import { test } from '@playwright/test';

test('Navigate and Perform Actions', async ({ page }) => {
  const timeout = 5000;

  // Set viewport
  await page.setViewportSize({ width: 1425, height: 230 });

  // Navigate to the first URL
  await page.goto('https://onlinelibrary.wiley.com/?logout=true');
  await page.waitForTimeout(timeout);

  // Navigate to the second URL
  await page.goto('https://onlinelibrary.wiley.com/');
  await page.waitForTimeout(timeout);

  // Click on the login button
  await Promise.race([
    page.click('span.sign-in-label'),
    page.waitForSelector('::-p-text(Login / Register)'),
  ]);

  // Fill in the username
  await Promise.race([
    page.fill('#username', 'malinda939@gmail.com'),
    page.waitForSelector('#username'),
  ]);

  // Tab key press
  await page.keyboard.press('Tab');

  // Fill in the password
  await Promise.race([
    page.fill('#password', 'Malinda@2030'),
    page.waitForSelector('#password'),
  ]);

  // Click on the Log In button
  await Promise.race([
    page.click('div.align-end input'),
    page.waitForSelector('::-p-text(Log In)'),
  ]);

  // Wait for the element with class 'cls'
  await waitForElement(
    {
      type: 'waitForElement',
      selectors: [
        ['.cls'],
      ],
    },
    page,
    timeout
  );
});

async function waitForElement(step, frame, timeout) {
  const {
    count = 1,
    operator = '>=',
    visible = true,
    properties,
    attributes,
  } = step;
  const compFn = {
    '==': (a, b) => a === b,
    '>=': (a, b) => a >= b,
    '<=': (a, b) => a <= b,
  }[operator];
  await waitForFunction(async () => {
    const elements = await querySelectorsAll(step.selectors, frame);
    let result = compFn(elements.length, count);
    const elementsHandle = await frame.evaluateHandle(
      (...elements) => {
        return elements;
      },
      ...elements
    );
    await Promise.all(elements.map((element) => element.dispose()));
    if (result && (properties || attributes)) {
      result = await elementsHandle.evaluate(
        (elements, properties, attributes) => {
          for (const element of elements) {
            if (attributes) {
              for (const [name, value] of Object.entries(attributes)) {
                if (element.getAttribute(name) !== value) {
                  return false;
                }
              }
            }
            if (properties) {
              if (!isDeepMatch(properties, element)) {
                return false;
              }
            }
          }
          return true;

          function isDeepMatch(a, b) {
            if (a === b) {
              return true;
            }
            if ((a && !b) || (!a && b)) {
              return false;
            }
            if (!(a instanceof Object) || !(b instanceof Object)) {
              return false;
            }
            for (const [key, value] of Object.entries(a)) {
              if (!isDeepMatch(value, b[key])) {
                return false;
              }
            }
            return true;
          }
        },
        properties,
        attributes
      );
    }
    await elementsHandle.dispose();
    return result === visible;
  }, timeout);
}

async function querySelectorsAll(selectors, frame) {
  for (const selector of selectors) {
    const result = await querySelectorAll(selector, frame);
    if (result.length) {
      return result;
    }
  }
  return [];
}

async function querySelectorAll(selector, frame) {
  if (!Array.isArray(selector)) {
    selector = [selector];
  }
  if (!selector.length) {
    throw new Error('Empty selector provided to querySelectorAll');
  }
  let elements = [];
  for (let i = 0; i < selector.length; i++) {
    const part = selector[i];
    if (i === 0) {
      elements = await frame.$$(part);
    } else {
      const tmpElements = elements;
      elements = [];
      for (const el of tmpElements) {
        elements.push(...(await el.$$(part)));
      }
    }
    if (elements.length === 0) {
      return [];
    }
    if (i < selector.length - 1) {
      const tmpElements = [];
      for (const el of elements) {
        const newEl = (await el.evaluateHandle(el => (el.shadowRoot ? el.shadowRoot : el) as Element)).asElement();
        if (newEl) {
          tmpElements.push(newEl);
        }
      }
      elements = tmpElements;
    }
  }
  return elements;
}

async function waitForFunction(fn, timeout) {
  let isActive = true;
  const timeoutId = setTimeout(() => {
    isActive = false;
  }, timeout);
  while (isActive) {
    const result = await fn();
    if (result) {
      clearTimeout(timeoutId);
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error('Timed out');
}
