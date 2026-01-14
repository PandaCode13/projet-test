// tests/e2e/specs/login-refactored.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Login Page - Refactored', () => {
  
  test('devrait afficher le formulaire de connexion', async ({ page }) => {
    await page.goto('/login');
    
    // Vérifier les éléments du formulaire
    await expect(page.getByRole('heading', { name: /connexion|login/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/mot de passe|password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /connexion|se connecter|login/i })).toBeVisible();
  });
  
  test('devrait afficher une erreur avec des identifiants invalides', async ({ page }) => {
    await page.goto('/login');
    
    // Remplir avec des données invalides
    await page.getByLabel(/email/i).fill('invalid@email.com');
    await page.getByLabel(/mot de passe/i).fill('wrongpassword');
    await page.getByRole('button', { name: /connexion/i }).click();
    
    // Attendre une réponse (API call)
    await page.waitForTimeout(1000);
    
    // Vérifier qu'un message d'erreur s'affiche
    // Soit une alerte, soit un élément d'erreur
    const errorElement = page.locator('[role="alert"], .error, .text-red-600');
    await expect(errorElement).toBeVisible();
  });
  
  test('devrait rediriger après connexion réussie', async ({ page }) => {
    // NOTE: Ce test nécessite un backend fonctionnel avec un utilisateur de test
    // Pour l'instant, nous vérifions juste que le formulaire soumet
    await page.goto('/login');
    
    // Remplir le formulaire (utilisez des données de test réelles si disponible)
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/mot de passe/i).fill('password123');
    
    // Soumettre
    await page.getByRole('button', { name: /connexion/i }).click();
    
    // Si le backend répond, on devrait être redirigé
    // Pour l'instant, vérifions juste que quelque chose se passe
    await expect(page).not.toHaveURL(/login/);
  });
});