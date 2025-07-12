import { test, expect } from '@playwright/test';
import { navItems } from '../../src/nav-items';

test.describe('All Pages Content Check', () => {

  navItems.forEach(({ to, title }) => {
    test(`${title} should not be blank`, async ({ page }) => {
      // Navigate to the page
      await page.goto(to);

      // Wait for the page to load
      await page.waitForLoadState('networkidle');

      // Check that the page is not blank
      const bodyText = await page.locator('body').textContent();
      expect(bodyText?.trim()).not.toBe('');
      expect(bodyText?.trim()).toBeTruthy();

      // Check for specific content indicators
      const hasMainContent = await page.locator('main, .main-content, #main').count();
      const hasHeadings = await page.locator('h1, h2, h3').count();
      const hasText = bodyText && bodyText.length > 50; // At least 50 characters

      // At least one of these should be true
      expect(hasMainContent > 0 || hasHeadings > 0 || hasText).toBeTruthy();

      // Check that there are no obvious error messages
      const errorMessages = await page.locator('text=/error|not found|404|500/i').count();
      expect(errorMessages).toBe(0);

      // Take a screenshot for debugging if needed
      await page.screenshot({
        path: `test-results/${title.replace(/\s+/g, '-').toLowerCase()}-screenshot.png`,
        fullPage: true
      });
    });
  });

  test('Check for common blank page indicators', async ({ page }) => {
    for (const { to, title } of navItems) {
      await page.goto(to);
      await page.waitForLoadState('networkidle');

      // Check for white/blank screen
      const bodyStyles = await page.locator('body').evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          backgroundColor: styles.backgroundColor,
          color: styles.color,
          display: styles.display
        };
      });

      // Check if body has actual content
      const visibleElements = await page.locator('body *:visible').count();
      expect(visibleElements).toBeGreaterThan(0);

      // Check page title is not empty
      const title = await page.title();
      expect(title).not.toBe('');

      console.log(`✓ ${title} - Title: "${title}", Visible elements: ${visibleElements}`);
    }
  });
});
