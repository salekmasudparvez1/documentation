import { categories, lessons, site, topics } from './remote-content';

export const publishedCategories = categories.filter((category) => category.status === 'published');
export const publishedTopics = topics.filter((topic) => topic.status === 'published');
export const publishedLessons = lessons.filter((lesson) => lesson.status === 'published');

export const registry = {
  site,
  categories,
  topics,
  lessons,
  publishedCategories,
  publishedTopics,
  publishedLessons,
};

export const categoryBySlug = new Map(categories.map((category) => [category.slug, category]));
export const topicBySlug = new Map(topics.map((topic) => [topic.slug, topic]));
export const lessonBySlug = new Map(lessons.map((lesson) => [lesson.slug, lesson]));

export function getCategoryBySlug(slug: string) {
  return publishedCategories.find((category) => category.slug === slug);
}

export function getTopicBySlug(categorySlug: string, topicSlug: string) {
  const category = getCategoryBySlug(categorySlug);
  if (!category) {
    return undefined;
  }

  return publishedTopics.find(
    (topic) => topic.categoryId === category.id && topic.slug === topicSlug
  );
}

export function getLessonBySlug(categorySlug: string, topicSlug: string, lessonSlug: string) {
  const topic = getTopicBySlug(categorySlug, topicSlug);
  if (!topic) {
    return undefined;
  }

  return publishedLessons.find(
    (lesson) => lesson.topicId === topic.id && lesson.slug === lessonSlug
  );
}

export function getTopicLessons(topicId: string) {
  return publishedLessons.filter((lesson) => lesson.topicId === topicId);
}

export function getCategoryTopics(categoryId: string) {
  return publishedTopics.filter((topic) => topic.categoryId === categoryId);
}

export function getCategoryOverview(categorySlug: string) {
  const category = getCategoryBySlug(categorySlug);
  if (!category) {
    return undefined;
  }

  const categoryTopics = getCategoryTopics(category.id);
  return {
    category,
    topics: categoryTopics,
    lessons: categoryTopics.flatMap((topic) => getTopicLessons(topic.id)),
  };
}

export function getLatestLessons(limit = 4) {
  return [...publishedLessons]
    .sort((a, b) => new Date(b.updatedAt).valueOf() - new Date(a.updatedAt).valueOf())
    .slice(0, limit);
}

export function getLessonBreadcrumbs(categorySlug: string, topicSlug: string, lessonSlug: string) {
  const category = getCategoryBySlug(categorySlug);
  const topic = getTopicBySlug(categorySlug, topicSlug);
  const lesson = getLessonBySlug(categorySlug, topicSlug, lessonSlug);

  return [
    { label: 'Docs', href: '/docs' },
    category ? { label: category.title, href: `/docs/${category.slug}` } : null,
    topic ? { label: topic.title, href: `/docs/${categorySlug}/${topic.slug}` } : null,
    lesson ? { label: lesson.title, href: `/docs/${categorySlug}/${topicSlug}/${lesson.slug}` } : null,
  ].filter(Boolean) as { label: string; href: string }[];
}

export function getTopicNavigation() {
  return publishedCategories.map((category) => ({
    ...category,
    topics: getCategoryTopics(category.id),
  }));
}
