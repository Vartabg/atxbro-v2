import { render, screen, fireEvent } from '@testing-library/react';
import VetNav from '../VetNav';

describe('VetNav component', () => {
  test('renders main menu by default', () => {
    render(<VetNav />);
    expect(
      screen.getByRole('heading', { name: /veterans benefits finder/i })
    ).toBeInTheDocument();
  });

  test('navigates to search view and back', () => {
    render(<VetNav />);
    const findBtn = screen.getByRole('button', { name: /find benefits/i });
    fireEvent.click(findBtn);
    expect(
      screen.getByRole('heading', { name: /search benefits/i })
    ).toBeInTheDocument();
    const backBtn = screen.getByRole('button', { name: /← menu/i });
    fireEvent.click(backBtn);
    expect(
      screen.getByRole('heading', { name: /veterans benefits finder/i })
    ).toBeInTheDocument();
  });
});
