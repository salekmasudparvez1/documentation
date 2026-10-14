import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const readJson = async (filePath) => JSON.parse(await fs.readFile(filePath, 'utf-8'));

const categories = await readJson(path.join(projectRoot, 'src/data/categories.json'));
const topics = await readJson(path.join(projectRoot, 'src/data/topics.json'));
const lessons = await readJson(path.join(projectRoot, 'src/data/lessons.json'));

const issues = [];

const categoryIds = categories.map((entry) => entry.id);
const topicIds = topics.map((entry) => entry.id);
const lessonIds = lessons.map((entry) => entry.id);

if (new Set(categoryIds).size !== categoryIds.length) {
  issues.push('Duplicate category ids detected.');
}
if (new Set(topicIds).size !== topicIds.length) {
  issues.push('Duplicate topic ids detected.');
}
if (new Set(lessonIds).size !== lessonIds.length) {
  issues.push('Duplicate lesson ids detected.');
}

const categoryRefs = new Set(categoryIds);
const topicRefs = new Set(topicIds);

for (const topic of topics) {
  if (!categoryRefs.has(topic.categoryId)) {
    issues.push(`Topic ${topic.id} references missing category ${topic.categoryId}.`);
  }
}

for (const lesson of lessons) {
  if (!topicRefs.has(lesson.topicId)) {
    issues.push(`Lesson ${lesson.id} references missing topic ${lesson.topicId}.`);
  }

  for (const prerequisite of lesson.prerequisites || []) {
    if (!lessonIds.includes(prerequisite)) {
      issues.push(`Lesson ${lesson.id} has an invalid prerequisite ${prerequisite}.`);
    }
  }

  for (const related of lesson.relatedLessons || []) {
    if (!lessonIds.includes(related)) {
      issues.push(`Lesson ${lesson.id} has an invalid related reference ${related}.`);
    }
  }

  if (lesson.status === 'published' && !Array.isArray(lesson.sections) || lesson.sections.length === 0) {
    issues.push(`Lesson ${lesson.id} is published but has no sections.`);
  }

  const routeKey = `${lesson.slug}-${lesson.topicId}`;
  const routeMap = new Map();
  if (routeMap.has(routeKey)) {
    issues.push(`Route collision for lesson ${lesson.id}.`);
  }
  routeMap.set(routeKey, lesson.id);
}

const publishedLessons = lessons.filter((lesson) => lesson.status === 'published');
const routes = new Set();
for (const lesson of publishedLessons) {
  const topic = topics.find((entry) => entry.id === lesson.topicId);
  const category = categories.find((entry) => entry.id === topic?.categoryId);
  const fullRoute = `/docs/${category?.slug ?? 'unknown'}/${topic?.slug ?? 'unknown'}/${lesson.slug}`;
  if (routes.has(fullRoute)) {
    issues.push(`Duplicate published route ${fullRoute}.`);
  }
  routes.add(fullRoute);
}

if (issues.length > 0) {
  console.error('Content validation failed:');
  for (const issue of issues) {
    console.error(`- ${issue}`);
  }
  process.exit(1);
}

console.log(`Validated ${categories.length} categories, ${topics.length} topics, and ${lessons.length} lessons.`);
