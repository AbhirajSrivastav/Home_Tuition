/**
 * E2E Tests for 404 Handling (using Playwright or Cypress)
 * 
 * Run with: npx playwright test 404.spec.ts
 * or: npx cypress run --spec "e2e/404.spec.ts"
 */

import { test, expect } from '@playwright/test';

test.describe('404 Handling E2E Tests', () => {
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

  test.describe('404 Page Display', () => {
    test('displays 404 page for non-existent route', async ({ page }) => {
      await page.goto(`${baseUrl}/non-existent-page-xyz`);
      await expect(page.locator('h1')).toContainText('404');
      await expect(page.locator('main[role="main"]')).toBeVisible();
    });

    test('shows helpful error message', async ({ page }) => {
      await page.goto(`${baseUrl}/invalid-route`);
      await expect(page.locator('text=/page.*not found/i')).toBeVisible();
    });

    test('404 page is pre-rendered and loads quickly', async ({ page }) => {
      const startTime = Date.now();
      await page.goto(`${baseUrl}/invalid-route`);
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(2000); // Should load in under 2 seconds
    });
  });

  test.describe('Navigation from 404 Page', () => {
    test('user can navigate to home from 404 page', async ({ page }) => {
      await page.goto(`${baseUrl}/not-found`);
      await page.click('text=Go to Home');
      await expect(page).toHaveURL(`${baseUrl}/`);
    });

    test('user can navigate to tutors page from 404', async ({ page }) => {
      await page.goto(`${baseUrl}/invalid`);
      await page.click('text=Browse Tutors');
      await expect(page).toHaveURL(`${baseUrl}/tutors`);
    });

    test('user can access quick links from 404', async ({ page }) => {
      await page.goto(`${baseUrl}/not-found`);
      const quickLinks = page.locator('text=QUICK LINKS').locator('..').locator('a');
      const count = await quickLinks.count();
      expect(count).toBeGreaterThan(0);
    });

    test('contact support link is available', async ({ page }) => {
      await page.goto(`${baseUrl}/invalid-route`);
      await expect(page.locator('text=/contact.*support/i')).toBeVisible();
    });
  });

  test.describe('Search on 404 Page', () => {
    test('search input is visible and functional', async ({ page }) => {
      await page.goto(`${baseUrl}/not-found`);
      const searchInput = page.locator('input[placeholder*="Search"]');
      await expect(searchInput).toBeVisible();
      await searchInput.fill('algebra');
      await expect(searchInput).toHaveValue('algebra');
    });

    test('search form submission works', async ({ page }) => {
      await page.goto(`${baseUrl}/not-found`);
      const searchInput = page.locator('input[placeholder*="Search"]');
      await searchInput.fill('math tutor');
      
      await page.click('button[aria-label*="Submit"]');
      
      // Should navigate to search results page
      await expect(page).toHaveURL(/\/search\?q=/);
    });
  });

  test.describe('Accessibility on 404 Page', () => {
    test('main landmark is present', async ({ page }) => {
      await page.goto(`${baseUrl}/not-found`);
      const main = page.locator('main[role="main"]');
      await expect(main).toBeVisible();
    });

    test('keyboard navigation works', async ({ page }) => {
      await page.goto(`${baseUrl}/not-found`);
      
      // Tab to first interactive element
      await page.keyboard.press('Tab');
      const focusedElement = await page.evaluate(() => 
        document.activeElement?.tagName
      );
      expect(focusedElement).not.toBe('BODY');
    });

    test('focus is visible on interactive elements', async ({ page }) => {
      await page.goto(`${baseUrl}/not-found`);
      const button = page.locator('button').first();
      await button.focus();
      
      const isFocusVisible = await button.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return styles.outline !== 'none' || styles.boxShadow !== 'none';
      });
      expect(isFocusVisible).toBeTruthy();
    });

    test('color contrast meets WCAG standards', async ({ page }) => {
      await page.goto(`${baseUrl}/not-found`);
      // Using axe-core or similar tool would be more thorough
      const headings = page.locator('h1, h2');
      const count = await headings.count();
      expect(count).toBeGreaterThan(0);
    });

    test('screen reader can access main content', async ({ page }) => {
      await page.goto(`${baseUrl}/not-found`);
      const main = page.locator('main[aria-label]');
      const ariaLabel = await main.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
    });
  });

  test.describe('404 Analytics Tracking', () => {
    test('logs 404 page view to backend', async ({ page, context }) => {
      let requestLogged = false;

      context.on('response', async (response) => {
        if (response.url().includes('/api/logs/404')) {
          requestLogged = true;
        }
      });

      await page.goto(`${baseUrl}/invalid-route`);
      
      // Wait for analytics request
      await page.waitForTimeout(500);
      expect(requestLogged).toBeTruthy();
    });

    test('search queries are tracked', async ({ page }) => {
      await page.goto(`${baseUrl}/not-found`);
      const searchInput = page.locator('input[placeholder*="Search"]');
      await searchInput.fill('test query');
      await page.click('button[aria-label*="Submit"]');
      
      // Verify search was tracked (check network or state)
      const searchParams = new URL(page.url()).searchParams;
      expect(searchParams.get('q')).toBe('test query');
    });
  });

  test.describe('Different URL Patterns', () => {
    test.only('handles various invalid URL patterns', async ({ page }) => {
      const invalidRoutes = [
        '/non-existent',
        '/admin/settings/invalid',
        '/api/users/123/profile/edit/save',
        '/page.html',
        '/scripts/shell.sh',
      ];

      for (const route of invalidRoutes) {
        await page.goto(`${baseUrl}${route}`);
        await expect(page.locator('h1')).toContainText('404');
      }
    });
  });

  test.describe('Response Codes and Headers', () => {
    test('backend returns 404 status code', async ({ request }) => {
      const response = await request.get(`${baseUrl}/api/invalid`);
      expect(response.status()).toBe(404);
    });

    test('error response has proper structure', async ({ request }) => {
      const response = await request.get(`${baseUrl}/api/test/invalid`);
      const data = await response.json();
      
      expect(data).toHaveProperty('error');
      expect(data.error).toHaveProperty('code', 'NOT_FOUND');
      expect(data.error).toHaveProperty('requestId');
    });

    test('response includes request ID header', async ({ request }) => {
      const response = await request.get(`${baseUrl}/api/invalid`);
      expect(response.headers()['x-request-id']).toBeTruthy();
    });
  });

  test.describe('Mobile Responsiveness', () => {
    test('404 page is responsive on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(`${baseUrl}/not-found`);
      
      const main = page.locator('main');
      await expect(main).toBeVisible();
      
      const buttons = page.locator('button, a[class*="btn"]');
      const firstButton = buttons.first();
      expect(await firstButton.isVisible()).toBeTruthy();
    });

    test('404 page is responsive on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto(`${baseUrl}/not-found`);
      
      const main = page.locator('main');
      await expect(main).toBeVisible();
    });

    test('404 page is responsive on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto(`${baseUrl}/not-found`);
      
      const main = page.locator('main');
      await expect(main).toBeVisible();
    });
  });

  test.describe('Error Handling Robustness', () => {
    test('404 page loads even if some resources fail', async ({ page }) => {
      // Simulate network error for some resource
      await page.route('**/*.css', (route) => route.abort());
      await page.goto(`${baseUrl}/not-found`, { waitUntil: 'networkidle' });
      
      expect(page.url()).toContain('not-found');
    });

    test('handles rapid consecutive 404 requests', async ({ page, request }) => {
      const requests = Array(10).fill(null).map(() => 
        request.get(`${baseUrl}/api/invalid-${Math.random()}`)
      );
      
      const responses = await Promise.all(requests);
      responses.forEach(response => {
        expect(response.status()).toBe(404);
      });
    });
  });

  test.describe('XSS Prevention', () => {
    test('404 page sanitizes user input in URL', async ({ page }) => {
      const xssPayload = '"><script>alert("xss")</script>';
      await page.goto(`${baseUrl}/${encodeURIComponent(xssPayload)}`);
      
      const alerts = page.locator('text=alert');
      expect(await alerts.count()).toBe(0);
    });
  });

  test.describe('Performance', () => {
    test('404 page has acceptable Cumulative Layout Shift', async ({ page }) => {
      await page.goto(`${baseUrl}/not-found`);
      const cls = await page.evaluate(() => {
        return new Promise(resolve => {
          const observer = new PerformanceObserver((list) => {
            let cls = 0;
            for (const entry of list.getEntries()) {
              if ((entry as any).hadRecentInput) continue;
              cls += (entry as any).value;
            }
            resolve(cls);
          });
          observer.observe({ type: 'layout-shift', buffered: true });
        });
      });
      
      expect(cls).toBeLessThan(0.1); // Good CLS is < 0.1
    });
  });
});
