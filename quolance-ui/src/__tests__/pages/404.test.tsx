import { render, screen } from '@testing-library/react';

import NotFoundPage from '@/app/not-found';

describe('404', () => {
  it('renders a heading', () => {
    render(<NotFoundPage />);

    const heading = screen.getByText(/not found/i);

    expect(heading).toBeInTheDocument();
  });
});
