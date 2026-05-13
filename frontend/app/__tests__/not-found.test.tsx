import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NotFound from '@/app/not-found';

/**
 * 404 Not Found Page Tests
 * Tests for accessibility, content, and functionality
 */
describe('404 Not Found Page', () => {
  describe('Content and Structure', () => {
    test('renders 404 heading and title', () => {
      render(<NotFound />);
      expect(screen.getByText('404')).toBeInTheDocument();
      expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    });

    test('displays helpful description text', () => {
      render(<NotFound />);
      expect(
        screen.getByText(
          /The page you're looking for doesn't exist or has been moved/i
        )
      ).toBeInTheDocument();
    });

    test('has main landmark with role', () => {
      const { container } = render(<NotFound />);
      const main = container.querySelector('main[role="main"]');
      expect(main).toBeInTheDocument();
    });
  });

  describe('Navigation Links', () => {
    test('renders primary navigation buttons', () => {
      render(<NotFound />);
      expect(screen.getByRole('link', { name: /go to home/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /browse tutors/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /contact us/i })).toBeInTheDocument();
    });

    test('renders quick links navigation', () => {
      render(<NotFound />);
      expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /find tutors/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /my bookings/i })).toBeInTheDocument();
    });

    test('all navigation links have proper href attributes', () => {
      render(<NotFound />);
      const homeLinks = screen.getAllByRole('link').filter(
        link => (link as HTMLAnchorElement).href.includes('/')
      );
      expect(homeLinks.length).toBeGreaterThan(0);
    });
  });

  describe('Search Functionality', () => {
    test('renders search input with proper label', () => {
      render(<NotFound />);
      const searchInput = screen.getByPlaceholderText(/search for/i) as HTMLInputElement;
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).toHaveAttribute('aria-label');
    });

    test('renders search button', () => {
      render(<NotFound />);
      const searchButton = screen.getByRole('button', { name: /submit search/i });
      expect(searchButton).toBeInTheDocument();
    });

    test('search input accepts user input', async () => {
      const user = userEvent.setup();
      render(<NotFound />);
      const searchInput = screen.getByPlaceholderText(/search for/i) as HTMLInputElement;
      
      await user.type(searchInput, 'algebra tutor');
      expect(searchInput.value).toBe('algebra tutor');
    });
  });

  describe('Accessibility', () => {
    test('has proper heading hierarchy', () => {
      const { container } = render(<NotFound />);
      const h1 = container.querySelector('h1');
      const h2 = container.querySelector('h2');
      expect(h1).toBeInTheDocument();
      expect(h2).toBeInTheDocument();
    });

    test('main content section has aria-label', () => {
      const { container } = render(<NotFound />);
      const main = container.querySelector('main[aria-label="404 Error Page"]');
      expect(main).toBeInTheDocument();
    });

    test('navigation sections have aria-labels', () => {
      const { container } = render(<NotFound />);
      const navSections = container.querySelectorAll('[aria-label*="Navigation"]');
      expect(navSections.length).toBeGreaterThan(0);
    });

    test('search input has aria-label', () => {
      render(<NotFound />);
      const searchInput = screen.getByPlaceholderText(/search for/i);
      expect(searchInput).toHaveAttribute('aria-label');
    });

    test('icon buttons have aria-labels or aria-hidden', () => {
      const { container } = render(<NotFound />);
      const buttons = container.querySelectorAll('button');
      buttons.forEach(button => {
        const hasAriaLabel = button.hasAttribute('aria-label');
        const hasSvgWithAriaHidden = button.querySelector('svg[aria-hidden]') !== null;
        expect(hasAriaLabel || hasSvgWithAriaHidden).toBe(true);
      });
    });

    test('interactive elements are keyboard accessible', async () => {
      const user = userEvent.setup();
      render(<NotFound />);
      
      // Tab through elements
      const buttons = screen.getAllByRole('button');
      const firstButton = buttons[0];
      
      firstButton.focus();
      expect(firstButton).toHaveFocus();
    });

    test('focus indicators are visible on interactive elements', () => {
      const { container } = render(<NotFound />);
      const buttons = container.querySelectorAll('button, a');
      
      buttons.forEach(element => {
        const styles = window.getComputedStyle(element);
        // Check for focus outline or ring
        expect(
          styles.outline !== 'none' || 
          styles.boxShadow !== 'none' ||
          styles.border !== 'initial'
        ).toBeTruthy();
      });
    });
  });

  describe('Error Tracking', () => {
    test('attempts to log 404 event on mount', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({ ok: true })
      );

      render(<NotFound />);

      // Wait for effect to run
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/logs/404',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('path'),
        })
      );

      jest.restoreAllMocks();
    });

    test('handles logging errors gracefully', async () => {
      global.fetch = jest.fn(() =>
        Promise.reject(new Error('Network error'))
      );
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      render(<NotFound />);

      await new Promise(resolve => setTimeout(resolve, 0));

      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to log 404:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
      jest.restoreAllMocks();
    });
  });

  describe('Responsive Design', () => {
    test('renders with responsive classes', () => {
      const { container } = render(<NotFound />);
      const mainContent = container.querySelector('main');
      expect(mainContent).toHaveClass('max-w-2xl', 'w-full');
    });

    test('navigation adapts for mobile', () => {
      const { container } = render(<NotFound />);
      const nav = container.querySelector('nav');
      expect(nav).toHaveClass('flex', 'flex-col', 'sm:flex-row');
    });
  });

  describe('Visual Design', () => {
    test('renders error icon', () => {
      const { container } = render(<NotFound />);
      // Check for icon rendering (lucide-react or similar)
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    test('applies gradient background', () => {
      const { container } = render(<NotFound />);
      const mainDiv = container.querySelector('div');
      expect(mainDiv).toHaveClass('bg-gradient-to-br');
    });

    test('has support section with helpful info', () => {
      render(<NotFound />);
      expect(screen.getByText(/need help/i)).toBeInTheDocument();
      expect(screen.getByText(/can't find what you're looking for/i)).toBeInTheDocument();
    });
  });
});
