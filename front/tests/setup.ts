// src/test/setup.ts
import { expect } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';

expect.extend(matchers);

// Cleanup après chaque test
afterEach(() => {
  cleanup();
});