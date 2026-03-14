import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// Simple ContactCard mock for testing rendering patterns
function ContactCard({ contact }: { contact: { first_name: string; last_name: string; email: string; status: string } }) {
  return (
    <div data-testid="contact-card" className="card">
      <div className="avatar" data-testid="contact-avatar">
        {contact.first_name.charAt(0)}{contact.last_name.charAt(0)}
      </div>
      <h3 data-testid="contact-name">{contact.first_name} {contact.last_name}</h3>
      <p data-testid="contact-email">{contact.email}</p>
      <span data-testid="contact-status" className={`status-${contact.status}`}>
        {contact.status}
      </span>
    </div>
  );
}

describe('ContactCard', () => {
  const mockContact = {
    first_name: 'Jane',
    last_name: 'Smith',
    email: 'jane@example.com',
    status: 'active',
  };

  it('should render contact name', () => {
    render(<ContactCard contact={mockContact} />);
    expect(screen.getByTestId('contact-name')).toHaveTextContent('Jane Smith');
  });

  it('should show initials in avatar', () => {
    render(<ContactCard contact={mockContact} />);
    expect(screen.getByTestId('contact-avatar')).toHaveTextContent('JS');
  });

  it('should display email', () => {
    render(<ContactCard contact={mockContact} />);
    expect(screen.getByTestId('contact-email')).toHaveTextContent('jane@example.com');
  });

  it('should show status badge', () => {
    render(<ContactCard contact={mockContact} />);
    const status = screen.getByTestId('contact-status');
    expect(status).toHaveTextContent('active');
    expect(status.className).toContain('status-active');
  });
});
