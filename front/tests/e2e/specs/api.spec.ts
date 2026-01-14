// tests/e2e/specs/api.spec.ts
import { test, expect } from '@playwright/test';

test('l\'API backend répond', async ({ request }) => {
  // Testez une route de l'API
  const response = await request.get('http://localhost:3000/api/health');
  expect(response.ok()).toBeTruthy();
});

test('la route /auth/login existe', async ({ request }) => {
  const response = await request.post('http://localhost:3000/api/auth/login', {
    data: { email: 'test@test.com', password: 'test' }
  });
  // S'attendre à une erreur 400/401 (car données invalides) mais que l'endpoint existe
  expect([400, 401]).toContain(response.status());
});