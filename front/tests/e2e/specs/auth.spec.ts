// tests/e2e/specs/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentification GlycAmed', () => {
  
  test('page de login contient les champs requis', async ({ page }) => {
    await page.goto('/login');
    
    // Vérifie que les champs email et password existent
    await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"], input[name="password"]')).toBeVisible();
    
    // Vérifie le bouton de soumission
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });
  
  test('redirection vers la page d\'inscription', async ({ page }) => {
    await page.goto('/login');
    
    // Cherche un lien d'inscription (peut ne pas exister dans votre app)
    const registerLink = page.locator('a[href*="register"], a[href*="signup"]');
    
    if (await registerLink.count() > 0) {
      await registerLink.click();
      await expect(page).toHaveURL(/register|signup/);
    }
  });
});