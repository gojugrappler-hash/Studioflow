import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

function DealCard({ deal }: { deal: { title: string; value: number; contact_name: string; stage: string } }) {
  const formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(deal.value);
  return (
    <div data-testid="deal-card" className="deal-card">
      <h4 data-testid="deal-title">{deal.title}</h4>
      <p data-testid="deal-value" className="mono">{formatted}</p>
      <p data-testid="deal-contact">{deal.contact_name}</p>
      <span data-testid="deal-stage">{deal.stage}</span>
    </div>
  );
}

describe('DealCard', () => {
  const mockDeal = {
    title: 'Full Sleeve Tattoo',
    value: 3500,
    contact_name: 'Mike Johnson',
    stage: 'Proposal',
  };

  it('should render deal title', () => {
    render(<DealCard deal={mockDeal} />);
    expect(screen.getByTestId('deal-title')).toHaveTextContent('Full Sleeve Tattoo');
  });

  it('should format value as currency', () => {
    render(<DealCard deal={mockDeal} />);
    expect(screen.getByTestId('deal-value')).toHaveTextContent('$3,500.00');
  });

  it('should show contact name', () => {
    render(<DealCard deal={mockDeal} />);
    expect(screen.getByTestId('deal-contact')).toHaveTextContent('Mike Johnson');
  });

  it('should display stage', () => {
    render(<DealCard deal={mockDeal} />);
    expect(screen.getByTestId('deal-stage')).toHaveTextContent('Proposal');
  });
});
