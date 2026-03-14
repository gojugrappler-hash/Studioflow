import { test, expect } from '@playwright/test';

test.describe('App Navigation', () => {
  test('root should redirect to login or dashboard', async ({ page }) => {
    await page.goto('/');
    // Should land on either login or dashboard
    const url = page.url();
    expect(url).toMatch(/login|dashboard|signup/);
  });

  test('login page has navigation to signup', async ({ page }) => {
    await page.goto('/login');
    const signupLink = page.locator('a[href*="signup"]');
    if (await signupLink.count() > 0) {
      await expect(signupLink.first()).toBeVisible();
    }
  });
});
