import { defineConfig, Plugin } from 'vite';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Marked, Renderer } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';

// if we are rendering HTML in a markdown file don't wrap it in a <p>
Renderer.prototype.paragraph = (text) => {
  if (text.startsWith('<')) {
    return text + '\n';
  }
  return '<p>' + text + '</p>';
};

const marked = new Marked(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang, info) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    },
  })
);

const markdownPath = resolve(__dirname, './src/index.md');

const markdown: Plugin = {
  name: 'markdown',
  // Reload the server when the markdown file changes since it's not part of the build
  load() {
    this.addWatchFile(markdownPath);
  },
  async transformIndexHtml(html: string) {
    const styles = readFileSync(
      resolve(__dirname, './node_modules/highlight.js/styles/github.css'),
      'utf8'
    );
    const markdown = readFileSync(markdownPath, 'utf8');
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
