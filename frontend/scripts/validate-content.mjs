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
  if (typeof topic.icon !== 'string' || topic.icon.trim().length === 0) {
    issues.push(`Topic ${topic.id} must define an icon name in the remote db.`);
  }
  if (!categoryRefs.has(topic.categoryId)) {
    issues.push(`Topic ${topic.id} references missing category ${topic.categoryId}.`);
  }
}

for (const lesson of lessons) {
  if (!topicRefs.has(lesson.topicId)) {
    issues.push(`Lesson ${lesson.id} references missing topic ${lesson.topicId}.`);
  }

  for (const category of categories) {
    if (typeof category.icon !== 'string' || category.icon.trim().length === 0) {
      issues.push(`Category ${category.id} must define an icon name in the remote db.`);
    }
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
