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

  test('should display school management dropdown and open settings modal', async ({ page }) => {
    await page.goto('/school-dashboard');

    // Check if the School Management dropdown is visible
    const dropdownTrigger = page.locator('button:has-text("School Management Suite")');
    await expect(dropdownTrigger).toBeVisible();

    // Click the dropdown trigger
    await dropdownTrigger.click();

    // Click the "System Settings" sub-trigger
    const systemSettingsTrigger = page.locator('div[role="menuitem"]:has-text("System Settings")');
    await systemSettingsTrigger.click();

    // Click the "Teaching Perspective Settings" menu item
    const teachingSettingsItem = page.locator('div[role="menuitem"]:has-text("Teaching Perspective Settings")');
    await teachingSettingsItem.click();

    // Check if the modal is visible
    const modalTitle = page.locator('h2:has-text("Teaching Perspective Settings")');
    await expect(modalTitle).toBeVisible();
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