import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  // Navigate to the URL
  await page.goto('https://onlinelibrary.wiley.com/');

  // Click on the search input
  await page.locator('[placeholder="Search publications, articles"]').click();

  // Fill in the search term
  await page.locator('[placeholder="Search publications, articles"]').fill('microbiology');

  // Click on the 'Submit Search' button
  await page.locator('[aria-label="Submit Search"]').click();

  // Wait for the search results page to load
  await page.waitForLoadState();

  // Assert that the URL contains the search term
  expect(page.url()).toContain('microbiology');
});
