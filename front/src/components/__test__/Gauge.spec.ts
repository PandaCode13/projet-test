// src/components/__tests__/Gauge.test.tsx
import { render, screen } from '@testing-library/react';
import Gauge from '../Gauge';
import { describe, it, expect } from 'vitest';

describe('Gauge Component', () => {
  it('affiche le label et la valeur', () => {
    render(<Gauge label="Sucre" value={25} max={50} unit="g" />);
    
    expect(screen.getByText('Sucre')).toBeInTheDocument();
    expect(screen.getByText('25.00')).toBeInTheDocument();
    expect(screen.getByText('g')).toBeInTheDocument();
  });

  it('calcule correctement le pourcentage', () => {
    render(<Gauge label="Test" value={75} max={100} unit="%" />);
    
    // Vérifie que "75.00%" est affiché
    expect(screen.getByText('75.00')).toBeInTheDocument();
    expect(screen.getByText('75.0%')).toBeInTheDocument(); // Pourcentage formaté
  });
});