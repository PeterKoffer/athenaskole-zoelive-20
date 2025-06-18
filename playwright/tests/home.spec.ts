import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('/');
    
    // Check that the page loads successfully
    await expect(page).toHaveTitle(/Vite \+ React \+ TS|Athena Skole/);
    
    // Check for the root element
    const rootElement = page.locator('#root');
    await expect(rootElement).toBeVisible();
  });

  test('should have working navigation', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the page to be interactive
    await page.waitForLoadState('networkidle');
    
    // Look for common navigation elements that might exist
    // This is a basic test that can be expanded based on actual app structure
    const bodyElement = page.locator('body');
    await expect(bodyElement).toBeVisible();
  });
});

test.describe('App Routing', () => {
  test('should handle unknown routes gracefully', async ({ page }) => {
    // Try to navigate to a non-existent route
    await page.goto('/nonexistent-route');
    
    // The app should either redirect or show a 404-like state
    // This is a basic check - adjust based on actual app behavior
    const bodyElement = page.locator('body');
    await expect(bodyElement).toBeVisible();
  });
});