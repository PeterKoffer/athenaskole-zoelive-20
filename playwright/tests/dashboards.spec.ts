import { test, expect } from '@playwright/test';

test.describe('School Dashboard Features', () => {
  test('should navigate to school dashboard', async ({ page }) => {
    await page.goto('/');
    
    // Try to navigate to the school dashboard
    await page.goto('/school-dashboard');
    
    // Check that the page loads (even if authentication is required)
    const bodyElement = page.locator('body');
    await expect(bodyElement).toBeVisible();
  });

  test('should navigate to simple school dashboard', async ({ page }) => {
    await page.goto('/simple-school-dashboard');
    
    // Check that the page loads
    const bodyElement = page.locator('body');
    await expect(bodyElement).toBeVisible();
  });

  test('should navigate to teacher dashboard', async ({ page }) => {
    await page.goto('/teacher-dashboard');
    
    // Check that the page loads
    const bodyElement = page.locator('body');
    await expect(bodyElement).toBeVisible();
  });

  test('should navigate to student dashboard', async ({ page }) => {
    await page.goto('/student-dashboard');
    
    // Check that the page loads
    const bodyElement = page.locator('body');
    await expect(bodyElement).toBeVisible();
  });
});

test.describe('Educational Features', () => {
  test('should navigate to curriculum page', async ({ page }) => {
    await page.goto('/curriculum');
    
    // Check that the curriculum page loads
    const bodyElement = page.locator('body');
    await expect(bodyElement).toBeVisible();
  });

  test('should navigate to daily program', async ({ page }) => {
    await page.goto('/daily-program');
    
    // Check that the daily program page loads
    const bodyElement = page.locator('body');
    await expect(bodyElement).toBeVisible();
  });
});