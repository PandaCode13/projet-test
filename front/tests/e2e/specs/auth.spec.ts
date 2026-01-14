// tests/e2e/specs/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentification', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('page de login contient les éléments requis', async ({ page }) => {
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/mot de passe/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /connexion/i })).toBeVisible();
  });

  test('validation des champs du formulaire', async ({ page }) => {
    // Test email invalide
    await page.getByLabel(/email/i).fill('email-invalide');
    await page.getByLabel(/mot de passe/i).fill('test');
    
    // Vérifie qu'un message d'erreur apparaît
    await expect(page.getByText(/email invalide/i)).toBeVisible();
  });

  test('redirection après connexion réussie', async ({ page }) => {
    // Mock de la réponse API
    await page.route('**/auth/login', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          token: 'fake-jwt-token',
          user: { id: 1, email: 'test@example.com' }
        }),
      });
    });

    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/mot de passe/i).fill('password123');
    await page.getByRole('button', { name: /connexion/i }).click();

    // Vérifie la redirection
    await expect(page).toHaveURL('/dashboard');
  });
});