import { z } from 'zod';

export const siteSchema = z.object({
  title: z.string(),
  description: z.string(),
  author: z.string(),
  siteUrl: z.string().url(),
  defaultLanguage: z.string(),
  defaultTheme: z.enum(['light', 'dark', 'system']),
  logoText: z.string(),
  socialLinks: z.array(
    z.object({
      label: z.string(),
      url: z.string().url(),
    })
  ),
  navigation: z.object({
    primary: z.array(
      z.object({
        title: z.string(),
        url: z.string(),
      })
    ),
  }),
  search: z.object({
    enabled: z.boolean(),
    placeholder: z.string(),
  }),
  footer: z.object({
    copyright: z.string(),
  }),
});

export const categorySchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  slug: z.string(),
  icon: z.string().trim().min(1),
  order: z.number().int().nonnegative(),
  status: z.enum(['draft', 'published', 'archived']),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export const topicSchema = z.object({
  id: z.string(),
  categoryId: z.string(),
  title: z.string(),
  description: z.string(),
  slug: z.string(),
  order: z.number().int().nonnegative(),
  status: z.enum(['draft', 'published', 'archived']),
  tags: z.array(z.string()).optional(),
  icon: z.string().trim().min(1),
  prerequisites: z.array(z.string()).optional(),
});

const markdownSectionSchema = z.object({
  id: z.string(),
  type: z.literal('markdown'),
  title: z.string().optional(),
  content: z.string(),
});

const codeSectionSchema = z.object({
  id: z.string(),
  type: z.literal('code'),
  title: z.string().optional(),
  language: z.string().default('text'),
  content: z.string(),
  output: z.string().optional(),
  showLineNumbers: z.boolean().optional(),
});

const tableSectionSchema = z.object({
  id: z.string(),
  type: z.literal('table'),
  title: z.string().optional(),
  columns: z.array(z.string()),
  rows: z.array(z.array(z.union([z.string(), z.number(), z.boolean()]))),
});

const listSectionSchema = z.object({
  id: z.string(),
  type: z.literal('list'),
  title: z.string().optional(),
  items: z.array(z.string()),
});

const calloutSectionSchema = z.object({
  id: z.string(),
  type: z.literal('callout'),
  variant: z.enum(['info', 'success', 'warning', 'error']),
  title: z.string().optional(),
  content: z.string(),
});

const imageSectionSchema = z.object({
  id: z.string(),
  type: z.literal('image'),
  title: z.string().optional(),
  src: z.string(),
  alt: z.string(),
  caption: z.string().optional(),
});

const formulaSectionSchema = z.object({
  id: z.string(),
  type: z.literal('formula'),
  latex: z.string(),
  caption: z.string().optional(),
});

const diagramSectionSchema = z.object({
  id: z.string(),
  type: z.literal('diagram'),
  title: z.string().optional(),
  content: z.string(),
  caption: z.string().optional(),
});

const videoSectionSchema = z.object({
  id: z.string(),
  type: z.literal('video'),
  title: z.string().optional(),
  provider: z.enum(['youtube', 'vimeo', 'local']),
  url: z.string().url(),
  caption: z.string().optional(),
});

const exampleSectionSchema = z.object({
  id: z.string(),
  type: z.literal('example'),
  title: z.string().optional(),
  content: z.string(),
});

const quizSectionSchema = z.object({
  id: z.string(),
  type: z.literal('quiz'),
  title: z.string().optional(),
  questions: z.array(
    z.object({
      prompt: z.string(),
      options: z.array(z.string()),
      answer: z.string(),
    })
  ),
});

const checklistSectionSchema = z.object({
  id: z.string(),
  type: z.literal('checklist'),
  title: z.string().optional(),
  items: z.array(z.string()),
});

export const sectionSchema = z.discriminatedUnion('type', [
  markdownSectionSchema,
  codeSectionSchema,
  tableSectionSchema,
  listSectionSchema,
  calloutSectionSchema,
  imageSectionSchema,
  formulaSectionSchema,
  diagramSectionSchema,
  videoSectionSchema,
  exampleSectionSchema,
  quizSectionSchema,
  checklistSectionSchema,
]);

export const lessonSchema = z.object({
  id: z.string(),
  topicId: z.string(),
  title: z.string(),
  description: z.string(),
  slug: z.string(),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  status: z.enum(['draft', 'published', 'archived']),
  tags: z.array(z.string()),
  prerequisites: z.array(z.string()).optional(),
  relatedLessons: z.array(z.string()).optional(),
  sections: z.array(sectionSchema).min(1),
  sources: z.array(z.string().url()).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  estimatedReadingMinutes: z.number().int().positive().optional(),
  author: z.string().optional(),
  version: z.string().optional(),
  learningObjectives: z.array(z.string()).optional(),
});

export type SiteConfig = z.infer<typeof siteSchema>;
export type CategoryRecord = z.infer<typeof categorySchema>;
export type TopicRecord = z.infer<typeof topicSchema>;
export type LessonRecord = z.infer<typeof lessonSchema>;
export type SectionRecord = z.infer<typeof sectionSchema>;
