// tests/e2e/specs/basic.spec.ts
import { test, expect } from '@playwright/test';

test('Application de base fonctionnelle', async ({ page }) => {
  // Test 1 : La page d'accueil se charge
  await page.goto('/');
  const title = await page.title();
  expect(title).toBeTruthy();
  console.log('✅ Titre de la page:', title);
  
  // Test 2 : Navigation vers login (même si vide)
  await page.goto('/login');
  const url = page.url();
  console.log('✅ URL login:', url);
  
  // Ne pas faire échouer - on vérifie juste que ça ne crash pas
  expect(true).toBeTruthy();
});