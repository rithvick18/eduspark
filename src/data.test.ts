import { describe, it, expect } from 'vitest';
import { subjects, courses, quizQuestions } from './data';

describe('Static Data Configuration', () => {
  it('has correctly formatted subjects', () => {
    expect(subjects.length).toBeGreaterThan(0);
    for (const subject of subjects) {
      expect(subject).toHaveProperty('slug');
      expect(subject).toHaveProperty('name');
      expect(subject).toHaveProperty('icon');
      expect(subject).toHaveProperty('accent');
      expect(subject.tracks).toBeInstanceOf(Array);
    }
  });

  it('has valid course definitions matching subjects', () => {
    expect(courses.length).toBeGreaterThan(0);
    const subjectSlugs = subjects.map(s => s.slug);
    
    for (const course of courses) {
      expect(course).toHaveProperty('id');
      expect(course).toHaveProperty('title');
      expect(subjectSlugs).toContain(course.subjectSlug);
    }
  });

  it('has valid quiz questions with correct index bounds', () => {
    expect(quizQuestions.length).toBeGreaterThan(0);
    for (const q of quizQuestions) {
      expect(q.options.length).toBeGreaterThan(1);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(q.options.length);
    }
  });
});
