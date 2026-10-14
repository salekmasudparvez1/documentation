import { codeToHtml } from 'shiki';
import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

export function renderMarkdown(content: string) {
  const html = marked.parse(content, { gfm: true, breaks: true });
  return sanitizeHtml(String(html), {
    allowedTags: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'strong', 'em', 'a', 'ul', 'ol', 'li', 'blockquote', 'code',
      'pre', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'hr', 'span', 'img', 'figure', 'figcaption'
    ],
    allowedAttributes: {
      a: ['href', 'target', 'rel'],
      code: ['class'],
      pre: ['class'],
      img: ['src', 'alt', 'title'],
      span: ['class'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
  });
}

export async function renderCodeBlock(language: string, content: string) {
  return codeToHtml(content, {
    lang: language || 'text',
    theme: 'github-dark',
  });
}

export async function renderSection(section: any) {
  switch (section.type) {
    case 'markdown':
      return `<div class="prose prose-slate max-w-none dark:prose-invert">${renderMarkdown(section.content)}</div>`;
    case 'code': {
      const html = await renderCodeBlock(section.language || 'text', section.content);
      return `
        <figure class="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-slate-950 text-slate-50 dark:border-slate-700">
          ${section.title ? `<figcaption class="border-b border-slate-700 px-4 py-2 text-sm font-medium text-slate-200">${section.title}</figcaption>` : ''}
          <div class="relative">
            <button class="copy-code absolute right-3 top-3 rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-200 transition hover:bg-slate-700" data-copy-target="${section.id}">Copy</button>
            <div class="overflow-x-auto" data-code-block="${section.id}">${html}</div>
          </div>
          ${section.output ? `<div class="border-t border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-300">Output: <code class="rounded bg-slate-800 px-1 py-0.5">${sanitizeHtml(section.output)}</code></div>` : ''}
        </figure>
      `;
    }
    case 'table': {
      const headers = section.columns.map((column: string) => `<th class="border border-slate-200 bg-slate-50 px-3 py-2 text-left text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">${column}</th>`).join('');
      const rows = section.rows.map((row: unknown[]) => `<tr>${row.map((cell) => `<td class="border border-slate-200 px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-200">${String(cell)}</td>`).join('')}</tr>`).join('');
      return `
        <figure class="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
          ${section.title ? `<figcaption class="px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200">${section.title}</figcaption>` : ''}
          <div class="overflow-x-auto">
            <table class="min-w-full border-collapse text-left">
              <thead><tr>${headers}</tr></thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
        </figure>
      `;
    }
    case 'callout':
      return `
        <aside class="mt-6 rounded-xl border border-sky-200 bg-sky-50 p-4 text-slate-700 shadow-sm dark:border-sky-500/30 dark:bg-sky-950/40 dark:text-slate-200">
          <h3 class="mb-2 text-base font-semibold">${section.title || 'Note'}</h3>
          <div class="prose prose-slate max-w-none dark:prose-invert">${renderMarkdown(section.content)}</div>
        </aside>
      `;
    case 'formula':
      return `
        <figure class="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5 text-center dark:border-slate-700 dark:bg-slate-900">
          <div class="text-2xl font-medium text-slate-800 dark:text-slate-100">$${section.latex}$</div>
          ${section.caption ? `<figcaption class="mt-3 text-sm text-slate-600 dark:text-slate-300">${section.caption}</figcaption>` : ''}
        </figure>
      `;
    case 'checklist':
      return `
        <div class="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
          ${section.title ? `<h3 class="mb-3 text-base font-semibold text-slate-800 dark:text-slate-100">${section.title}</h3>` : ''}
          <ul class="space-y-2 text-sm text-slate-700 dark:text-slate-200">
            ${section.items.map((item: string) => `<li class="flex items-start gap-2"><span class="mt-1 inline-block h-2 w-2 rounded-full bg-sky-500"></span><span>${item}</span></li>`).join('')}
          </ul>
        </div>
      `;
    case 'list':
      return `
        <div class="mt-6 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
          ${section.title ? `<h3 class="mb-3 text-base font-semibold text-slate-800 dark:text-slate-100">${section.title}</h3>` : ''}
          <ul class="list-disc space-y-2 pl-5 text-slate-700 dark:text-slate-200">
            ${section.items.map((item: string) => `<li>${item}</li>`).join('')}
          </ul>
        </div>
      `;
    case 'image':
      return `
        <figure class="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
          <img src="${section.src}" alt="${section.alt}" class="w-full object-cover" />
          ${section.caption ? `<figcaption class="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">${section.caption}</figcaption>` : ''}
        </figure>
      `;
    case 'example':
      return `
        <div class="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-500/30 dark:bg-emerald-950/30">
          ${section.title ? `<h3 class="mb-2 text-base font-semibold text-slate-800 dark:text-slate-100">${section.title}</h3>` : ''}
          <div class="prose prose-slate max-w-none dark:prose-invert">${renderMarkdown(section.content)}</div>
        </div>
      `;
    default:
      return `
        <div class="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          ${section.title || 'Unrendered section'}
        </div>
      `;
  }
}

export async function renderLessonSections(sections: any[]) {
  const rendered = await Promise.all(sections.map((section) => renderSection(section)));
  return rendered.join('');
}
