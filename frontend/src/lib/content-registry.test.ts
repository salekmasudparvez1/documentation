import { describe, expect, test } from 'vitest';
import { registry } from './content-registry';

describe('content registry', () => {
  test('includes published categories and lessons', () => {
    expect(registry.publishedCategories.length).toBeGreaterThan(0);
    expect(registry.publishedLessons.length).toBeGreaterThan(0);
  });

  test('creates a route for every published lesson', () => {
    const routes = registry.publishedLessons.map((lesson) => {
      const topic = registry.topics.find((entry) => entry.id === lesson.topicId);
      const category = topic ? registry.publishedCategories.find((entry) => entry.id === topic.categoryId) : undefined;
      return `/docs/${category?.slug ?? 'unknown'}/${topic?.slug ?? 'unknown'}/${lesson.slug}`;
    });

    expect(routes.length).toBe(registry.publishedLessons.length);
    expect(routes[0]).toContain('/docs/');
  });
});
