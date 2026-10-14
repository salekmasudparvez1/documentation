import { categorySchema, lessonSchema, siteSchema, topicSchema } from './schemas';

export const contentSources = {
  site: 'https://raw.githubusercontent.com/salekmasudparvez1/documentation/refs/heads/main/db/site.json',
  categories: 'https://raw.githubusercontent.com/salekmasudparvez1/documentation/refs/heads/main/db/categories.json',
  topics: 'https://raw.githubusercontent.com/salekmasudparvez1/documentation/refs/heads/main/db/topics.json',
  lessons: 'https://raw.githubusercontent.com/salekmasudparvez1/documentation/refs/heads/main/db/lessons.json',
} as const;

async function fetchJson(url: string): Promise<unknown> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load content from ${url}: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export const site = siteSchema.parse(await fetchJson(contentSources.site));
export const categories = categorySchema.array().parse(await fetchJson(contentSources.categories));
export const topics = topicSchema.array().parse(await fetchJson(contentSources.topics));
export const lessons = lessonSchema.array().parse(await fetchJson(contentSources.lessons));
