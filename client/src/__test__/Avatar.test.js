import React from 'react';
import { render, screen } from '@testing-library/react';
import Avatar from '../components/User/Avatar';

describe('Avatar', () => {
  it('renders image when url string is provided', () => {
    render(<Avatar url="https://example.com/pic.png" user="john@example.com" />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'https://example.com/pic.png');
    expect(img).toHaveAttribute('alt', 'john@example.com');
  });

  it('renders fallback text when no url provided', () => {
    render(<Avatar user="jane@example.com" />);
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });
});
