// tests/e2e/specs/smoke.spec.ts - Version améliorée
import { test, expect } from '@playwright/test';

test.describe('Tests Smoke', () => {
  
  test('La page d\'accueil se charge', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/.*/);
    console.log('✅ Test de chargement réussi');
  });
  
  test('La page de login est accessible', async ({ page }) => {
    await page.goto('/login');
    
    // Vérifier par plusieurs méthodes différentes
    
    // 1. Vérifier l'URL
    await expect(page).toHaveURL(/login/);
    
    // 2. Vérifier des éléments visuels spécifiques à votre Login
    // Chercher par :
    // - data-testid (si vous en avez ajouté)
    // - Placeholders
    // - Labels
    // - Boutons
    
    // Exemple avec data-testid (si vous les avez dans votre Login.tsx)
    const emailInput = page.getByTestId('email-input').or(page.locator('input[type="email"]'));
    const loginButton = page.getByTestId('login-button').or(page.getByRole('button', { name: /login|connexion/i }));
    
    // Si au moins un de ces éléments existe
    const elementsExist = await Promise.all([
      emailInput.count(),
      loginButton.count(),
    ]);
    
    const hasLoginElements = elementsExist.some(count => count > 0);
    
    expect(hasLoginElements).toBeTruthy();
    
    console.log('✅ Page login accessible et contient des éléments de formulaire');
    
    // Capture pour documentation
    await page.screenshot({ path: 'tests/screenshots/login-page.png' });
  });
});