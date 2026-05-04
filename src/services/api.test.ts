import { describe, it, expect, vi, beforeEach } from 'vitest';
import { contentAPI } from './api';

describe('API Service', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    
    // Mock localStorage
    const store = new Map();
    vi.stubGlobal('localStorage', {
      getItem: vi.fn((key) => store.get(key) || null),
      setItem: vi.fn((key, value) => store.set(key, value)),
      clear: vi.fn(() => store.clear())
    });
    
    // Mock global fetch
    global.fetch = vi.fn();
  });

  describe('contentAPI.getContent', () => {
    it('fetches content and caches it', async () => {
      const mockResponse = {
        success: true,
        data: {
          summary: 'Mock Summary',
          key_points: [],
          important_formulas: [],
          ncert_reference: '',
          suggested_videos: [],
          practice_questions: [],
          youtube_videos: []
        },
        board: 'CBSE',
        subject: 'Science'
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await contentAPI.getContent('CBSE', 'Science', 'Light');
      
      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledTimes(1);
      
      const expectedUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/content`;
      expect(global.fetch).toHaveBeenCalledWith(expectedUrl, expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ board: 'CBSE', subject: 'Science', chapter: 'Light' })
      }));

      // Verify it was cached
      const cacheKey = 'content:CBSE:Science:Light:overview';
      expect(localStorage.getItem(cacheKey)).toBe(JSON.stringify(mockResponse));
    });

    it('returns cached content on subsequent calls or failure', async () => {
      const mockResponse = {
        success: true,
        data: { summary: 'Cached Summary' },
        board: 'CBSE',
        subject: 'Maths'
      };

      const cacheKey = 'content:CBSE:Maths:Algebra:overview';
      localStorage.setItem(cacheKey, JSON.stringify(mockResponse));

      // Force fetch to fail
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      const result = await contentAPI.getContent('CBSE', 'Maths', 'Algebra');
      
      expect(result).toEqual({ ...mockResponse, cached: true });
    });
  });

  describe('contentAPI.generatePaper', () => {
    it('generates practice paper and caches it', async () => {
      const mockPaper = {
        mcqs: [{ q: 'Test Q', options: ['A','B','C','D'], correct: 'A' }],
        short: [],
        long: []
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockPaper
      });

      const result = await contentAPI.generatePaper('ICSE', 'History', 'WW1');
      expect(result).toEqual(mockPaper);
      
      const cacheKey = 'paper:ICSE:History:WW1:medium';
      expect(localStorage.getItem(cacheKey)).toBe(JSON.stringify(mockPaper));
    });
  });
});
