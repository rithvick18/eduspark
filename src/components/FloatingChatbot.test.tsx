import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FloatingChatbot } from './FloatingChatbot';
import { contentAPI } from '../services/api';

// Mock the API
vi.mock('../services/api', () => ({
  contentAPI: {
    askQuestion: vi.fn()
  }
}));

describe('FloatingChatbot Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Scroll Into View is not fully supported in jsdom
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  it('initially renders as a floating action button', () => {
    render(<FloatingChatbot />);
    const fab = screen.getByLabelText('Open AI Tutor Chat');
    expect(fab).toBeInTheDocument();
  });

  it('opens chat window when FAB is clicked', async () => {
    render(<FloatingChatbot />);
    const fab = screen.getByLabelText('Open AI Tutor Chat');
    fireEvent.click(fab);

    const title = screen.getByText('EduSpark AI Tutor');
    expect(title).toBeInTheDocument();
  });

  it('sends message and displays AI response', async () => {
    (contentAPI.askQuestion as any).mockResolvedValue({
      answer: 'This is an AI generated test response.'
    });

    render(<FloatingChatbot />);
    
    // Open chat
    fireEvent.click(screen.getByLabelText('Open AI Tutor Chat'));

    // Find input and submit
    const input = screen.getByPlaceholderText('Ask anything about your studies...');
    fireEvent.change(input, { target: { value: 'What is 2+2?' } });
    
    // Send message
    fireEvent.submit(input);

    // Verify user message appears immediately
    expect(screen.getByText('What is 2+2?')).toBeInTheDocument();
    
    // Verify API is called
    expect(contentAPI.askQuestion).toHaveBeenCalledWith('What is 2+2?', expect.any(Object));

    // Wait for AI response
    await waitFor(() => {
      expect(screen.getByText('This is an AI generated test response.')).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully using fallback responses', async () => {
    (contentAPI.askQuestion as any).mockRejectedValue(new Error('Network error'));

    render(<FloatingChatbot />);
    fireEvent.click(screen.getByLabelText('Open AI Tutor Chat'));

    const input = screen.getByPlaceholderText('Ask anything about your studies...');
    fireEvent.change(input, { target: { value: 'Explain photosynthesis' } });
    fireEvent.submit(input);

    await waitFor(() => {
      const response = screen.getByText(/Photosynthesis is how plants make their own food/i);
      expect(response).toBeInTheDocument();
    });
  });
});
