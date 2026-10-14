import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const contentSources = {
  categories: 'https://raw.githubusercontent.com/salekmasudparvez1/documentation/refs/heads/main/db/categories.json',
  topics: 'https://raw.githubusercontent.com/salekmasudparvez1/documentation/refs/heads/main/db/topics.json',
  lessons: 'https://raw.githubusercontent.com/salekmasudparvez1/documentation/refs/heads/main/db/lessons.json',
};

const readJson = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load content from ${url}: ${response.status} ${response.statusText}`);
  }
  return response.json();
};

const categories = await readJson(contentSources.categories);
const topics = await readJson(contentSources.topics);
const lessons = await readJson(contentSources.lessons);

const topicMap = new Map(topics.map((topic) => [topic.id, topic]));
const categoryMap = new Map(categories.map((category) => [category.id, category]));

const documents = lessons
  .filter((lesson) => lesson.status === 'published')
  .map((lesson) => {
    const topic = topicMap.get(lesson.topicId);
    const category = topic ? categoryMap.get(topic.categoryId) : undefined;
    const text = lesson.sections
      .filter((section) => ['markdown', 'callout', 'list', 'example', 'checklist'].includes(section.type))
      .map((section) => {
        if (section.type === 'markdown') return section.content;
        if ('content' in section && typeof section.content === 'string') return section.content;
        if ('items' in section && Array.isArray(section.items)) return section.items.join(' ');
        return '';
      })
      .join(' ');

    return {
      title: lesson.title,
      description: lesson.description,
      url: category && topic ? `/docs/${category.slug}/${topic.slug}/${lesson.slug}` : `/docs`,
      content: `${lesson.title} ${lesson.description} ${text}`,
    };
  });

await fs.mkdir(path.join(projectRoot, 'public'), { recursive: true });
await fs.writeFile(
  path.join(projectRoot, 'public/search-index.json'),
  JSON.stringify(documents, null, 2)
);

console.log(`Generated ${documents.length} searchable lesson documents.`);
