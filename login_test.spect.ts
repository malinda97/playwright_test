import { test, expect } from '@playwright/test';

test('Recording 08/01/2024 at 23:03:36', async ({ page }) => {
  const timeout = 5000;

  // Set viewport
  await page.setViewportSize({ width: 1425, height: 481 });

  // Navigate to the URL
  await page.goto('https://onlinelibrary.wiley.com/?logout=true');
  await page.waitForLoadState();

  // Click on the login button
  await Promise.race([
    page.click('span.sign-in-label'),
    page.click('xpath=//*[@id="pb-page-content"]/div/div[1]/header/div/div[2]/div/div/div/div[2]/div/div[2]/div/div/a/span[2]'),
    page.click('text=Login / Register')
  ]);

  // KeyUp event for '2'
  await page.keyboard.up('2');

  // Fill in the username
  await Promise.race([
    page.fill('#username', 'malinda939@gmail.com'),
    page.fill('xpath=//*[@id="username"]', 'malinda939@gmail.com')
  ]);

  // Tab key press
  await page.keyboard.press('Tab');

  // Tab key release
  await page.keyboard.up('Tab');

  // KeyUp event for '2'
  await page.keyboard.up('2');

  // Fill in the password
  await Promise.race([
    page.fill('#password', 'Malinda@2030'),
    page.fill('xpath=//*[@id="password"]', 'Malinda@2030')
  ]);


  // Click on the Log In button
  await Promise.race([
    page.click('div.align-end input'),
    page.click('xpath=//*[@id={}]/div[5]/span/input'),
    page.click('text=Log In')
  ]);

  // Wait for navigation
  const navigationPromise = page.waitForNavigation();

  // Assert navigation
  const navigationEvent = await navigationPromise;
  expect(navigationEvent.url()).toBe('https://onlinelibrary.wiley.com/?logout=true');
});
