// tests/e2e/specs/diagnostic.spec.ts
import { test, expect } from '@playwright/test';

test('Diagnostic de la page login', async ({ page }) => {
  await page.goto('/login');
  
  // 1. Capturer le HTML complet
  const html = await page.content();
  console.log('HTML de la page (premiers 1000 caractères):', html.substring(0, 1000));
  
  // 2. Capturer le texte visible
  const text = await page.textContent('body');
  console.log('Texte de la page:', text);
  
  // 3. Lister tous les éléments
  const allElements = await page.locator('*').all();
  console.log(`Nombre total d'éléments: ${allElements.length}`);
  
  // 4. Chercher spécifiquement des éléments
  const inputs = await page.locator('input').all();
  console.log(`Nombre d'inputs: ${inputs.length}`);
  
  for (const input of inputs) {
    const type = await input.getAttribute('type');
    const placeholder = await input.getAttribute('placeholder');
    console.log(`Input - type: ${type}, placeholder: ${placeholder}`);
  }
  
  // 5. Prendre une capture d'écran
  await page.screenshot({ path: 'tests/diagnostic/login-diagnostic.png', fullPage: true });
  
  // Ne pas faire échouer le test
  expect(true).toBeTruthy();
});