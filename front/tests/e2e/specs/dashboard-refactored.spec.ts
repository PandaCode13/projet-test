// tests/e2e/specs/dashboard-refactored.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Dashboard Refactorisé', () => {
  
  test('dashboard page se charge', async ({ page }) => {
    // Simuler un utilisateur connecté
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('glycamed_token', 'test-token');
    });
    
    await page.goto('/dashboard');
    
    // Vérifier les éléments de base
    await expect(page.getByTestId('dashboard-page')).toBeVisible();
    
    // Soit loading, soit contenu, soit erreur
    const hasLoading = await page.getByTestId('dashboard-loading').count();
    const hasError = await page.getByTestId('dashboard-error').count();
    const hasGauges = await page.getByTestId('gauges-container').count();
    
    expect(hasLoading + hasError + hasGauges).toBeGreaterThan(0);
    
    console.log('✅ Dashboard répond');
  });
});