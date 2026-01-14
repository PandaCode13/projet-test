// tests/glycamed.spec.ts
import { test, expect } from '@playwright/test';

test('la page d\'accueil GlycAmed fonctionne', async ({ page }) => {
  // Remplacez par l'URL de votre application locale
  await page.goto('http://localhost:3000');
  
  // Vérifiez un élément spécifique de votre app
  await expect(page.getByText(/glycamed/i)).toBeVisible();
  
  console.log('✅ Test GlycAmed réussi !');
});