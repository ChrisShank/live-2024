import { defineConfig, Plugin } from 'vite';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';

const marked = new Marked(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang, info) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    },
  })
);

const markdown: Plugin = {
  name: 'markdown',
  transformIndexHtml: async (html: string) => {
    const styles = readFileSync(
      resolve(__dirname, './node_modules/highlight.js/styles/github.css'),
      'utf8'
    );
    const markdown = readFileSync(resolve(__dirname, './index.md'), 'utf8');
    const content = await marked.parse(markdown);

    return html.replace('{{ STYLES }}', styles).replace('{{ MARKDOWN }}', content);
  },
};

export default defineConfig({
  plugins: [markdown],
  build: {
    modulePreload: {
      polyfill: false,
    },
  },
});
