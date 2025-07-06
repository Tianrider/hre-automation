import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { Star } from '../Star';

describe('Star component', () => {
  it('renders a filled star when filled=true', () => {
    const { container } = render(<Star filled={true} size={24} />);
    // Should have a filled color (currentColor or fill)
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg?.getAttribute('fill')).not.toBe('none');
  });

  it('renders an empty star when filled=false', () => {
    const { container } = render(<Star filled={false} size={24} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg?.getAttribute('fill')).toBe('none');
  });

  it('applies the correct size', () => {
    const { container } = render(<Star filled={true} size={42} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '42');
    expect(svg).toHaveAttribute('height', '42');
  });
}); 