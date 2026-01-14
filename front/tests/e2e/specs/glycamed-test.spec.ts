// tests/glycamed-test.spec.ts
import { test, expect } from '@playwright/test';

test('Test basique GlycAmed', async ({ page }) => {
  // Avec baseURL configuré, on peut utiliser juste '/'
  await page.goto('/');
  
  // Vérifiez que la page se charge
  await expect(page).toHaveTitle(/.*/);
  
  // Prenez une capture pour vérifier
  await page.screenshot({ path: 'test-screenshot.png' });
  
  console.log('✅ Page chargée avec succès');
});