import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

function KPICard({ label, value, change, changeType }: { label: string; value: string; change: string; changeType: 'positive' | 'negative' | 'neutral' }) {
  return (
    <div data-testid="kpi-card" className="kpi-card glass">
      <p data-testid="kpi-label" className="kpi-label">{label}</p>
      <h2 data-testid="kpi-value" className="kpi-value mono">{value}</h2>
      <span data-testid="kpi-change" className={`kpi-change kpi-${changeType}`}>
        {changeType === 'positive' ? '↑' : changeType === 'negative' ? '↓' : '→'} {change}
      </span>
    </div>
  );
}

describe('KPICard', () => {
  it('should render label and value', () => {
    render(<KPICard label="Revenue" value="$12,500" change="+12%" changeType="positive" />);
    expect(screen.getByTestId('kpi-label')).toHaveTextContent('Revenue');
    expect(screen.getByTestId('kpi-value')).toHaveTextContent('$12,500');
  });

  it('should show positive indicator', () => {
    render(<KPICard label="Leads" value="45" change="+8%" changeType="positive" />);
    expect(screen.getByTestId('kpi-change')).toHaveTextContent('↑ +8%');
  });

  it('should show negative indicator', () => {
    render(<KPICard label="Churn" value="3" change="-2%" changeType="negative" />);
    expect(screen.getByTestId('kpi-change')).toHaveTextContent('↓ -2%');
  });

  it('should apply glassmorphic class', () => {
    render(<KPICard label="Test" value="0" change="0%" changeType="neutral" />);
    const card = screen.getByTestId('kpi-card');
    expect(card.className).toContain('glass');
  });
});
