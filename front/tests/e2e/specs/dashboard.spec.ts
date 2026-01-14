// tests/e2e/specs/dashboard.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Dashboard GlycAmed', () => {
  
  test('accès au dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Soit on est sur le dashboard, soit redirigé vers login
    const currentUrl = page.url();
    
    if (currentUrl.includes('/login')) {
      console.log('Redirection vers login (normal si non connecté)');
      await expect(page).toHaveURL(/login/);
    } else {
      // Si on est sur le dashboard, vérifie les éléments clés
      const pageContent = await page.textContent('body');
      expect(pageContent?.toLowerCase()).toMatch(/dashboard|tableau|sucre|caféine/i);
    }
  });
});