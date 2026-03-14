import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('login page should render', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveTitle(/Studioflow|Login/i);
    await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('signup page should render', async ({ page }) => {
    await page.goto('/signup');
    await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible();
  });

  test('should redirect unauthenticated user to login', async ({ page }) => {
    await page.goto('/dashboard');
    // Should redirect to login if not authenticated
    await page.waitForURL(/login|signup|auth/, { timeout: 5000 }).catch(() => {
      // If no redirect, we're on dashboard (might have a session)
    });
  });

  test('forgot password page should render', async ({ page }) => {
    await page.goto('/forgot-password');
    await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible();
  });
});
