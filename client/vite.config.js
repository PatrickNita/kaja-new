import { readFileSync, existsSync, cpSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { LOCALIZED_PAGE_PATTERN, LOCALIZED_PAGES, PREFIXED_LOCALES } from './src/i18n/config.js';

const prefixedLocalePattern = new RegExp(`^/(${PREFIXED_LOCALES.join('|')})/?$`);
const englishSubpagePattern = new RegExp(`^/(${LOCALIZED_PAGES.join('|')})/?$`);
const localizedCatalogueProductPattern = new RegExp(`^/(${PREFIXED_LOCALES.join('|')})/catalogue/([^/]+)/?$`);
const englishCatalogueProductPattern = /^\/catalogue\/([^/]+)\/?$/;
const localizedMerchProductPattern = new RegExp(`^/(${PREFIXED_LOCALES.join('|')})/merch/([^/]+)/?$`);
const englishMerchProductPattern = /^\/merch\/([^/]+)\/?$/;
const RESERVED_CATALOGUE_SLUGS = new Set(['products', 'product']);
const RESERVED_MERCH_SLUGS = new Set(['products', 'product']);

function localeAssetsPlugin() {
  const localesDir = resolve('locales');
  const publicLocalesDir = resolve('public/locales');

  const syncLocales = () => {
    mkdirSync(publicLocalesDir, { recursive: true });
    cpSync(localesDir, publicLocalesDir, { recursive: true });
  };

  return {
    name: 'kaja-locale-assets',
    buildStart: syncLocales,
    configureServer: syncLocales,
    writeBundle(options) {
      const outDir = options.dir || resolve('dist');
      mkdirSync(resolve(outDir, 'locales'), { recursive: true });
      cpSync(localesDir, resolve(outDir, 'locales'), { recursive: true });
    }
  };
}

function sendSubpageHtml(page, rootDir, res) {
  const filePath = resolve(rootDir, page, 'index.html');
  if (!existsSync(filePath)) return false;

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(readFileSync(filePath));
  return true;
}

function sendCatalogueProductHtml(rootDir, res) {
  const filePath = resolve(rootDir, 'catalogue', 'product', 'index.html');
  if (!existsSync(filePath)) return false;

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(readFileSync(filePath));
  return true;
}

function sendMerchProductHtml(rootDir, res) {
  const filePath = resolve(rootDir, 'merch', 'product', 'index.html');
  if (!existsSync(filePath)) return false;

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(readFileSync(filePath));
  return true;
}

function isMerchProductPath(pathname) {
  const localizedProductMatch = pathname.match(localizedMerchProductPattern);
  if (localizedProductMatch && !RESERVED_MERCH_SLUGS.has(localizedProductMatch[2])) {
    return true;
  }

  const englishProductMatch = pathname.match(englishMerchProductPattern);
  return Boolean(englishProductMatch && !RESERVED_MERCH_SLUGS.has(englishProductMatch[1]));
}

function createLocaleMiddleware(rootDir) {
  return (req, res, next) => {
    const pathname = req.url?.split('?')[0] ?? '/';

    if (pathname === '/en' || pathname === '/en/') {
      res.writeHead(302, { Location: '/' });
      res.end();
      return;
    }

    if (/^\/en\/(catalogue|merch)\/?$/.test(pathname)) {
      const page = pathname.split('/')[2];
      res.writeHead(302, { Location: `/${page}` });
      res.end();
      return;
    }

    const localizedMerchProductMatch = pathname.match(localizedMerchProductPattern);
    if (localizedMerchProductMatch && !RESERVED_MERCH_SLUGS.has(localizedMerchProductMatch[2])) {
      if (sendMerchProductHtml(rootDir, res)) return;
    }

    const englishMerchProductMatch = pathname.match(englishMerchProductPattern);
    if (englishMerchProductMatch && !RESERVED_MERCH_SLUGS.has(englishMerchProductMatch[1])) {
      if (sendMerchProductHtml(rootDir, res)) return;
    }

    const localizedProductMatch = pathname.match(localizedCatalogueProductPattern);
    if (localizedProductMatch && !RESERVED_CATALOGUE_SLUGS.has(localizedProductMatch[2])) {
      if (sendCatalogueProductHtml(rootDir, res)) return;
    }

    const englishProductMatch = pathname.match(englishCatalogueProductPattern);
    if (englishProductMatch && !RESERVED_CATALOGUE_SLUGS.has(englishProductMatch[1])) {
      if (sendCatalogueProductHtml(rootDir, res)) return;
    }

    const localizedPageMatch = pathname.match(LOCALIZED_PAGE_PATTERN);
    if (localizedPageMatch && sendSubpageHtml(localizedPageMatch[2], rootDir, res)) {
      return;
    }

    if (englishSubpagePattern.test(pathname) && sendSubpageHtml(pathname.replace(/^\/|\/$/g, ''), rootDir, res)) {
      return;
    }

    if (prefixedLocalePattern.test(pathname)) {
      req.url = '/';
    }

    next();
  };
}

function localeSpaFallback() {
  const publicRoot = resolve('public');
  const distRoot = resolve('dist');

  return {
    name: 'kaja-locale-spa-fallback',
    configureServer(server) {
      server.middlewares.use(createLocaleMiddleware(publicRoot));
    },
    configurePreviewServer(server) {
      server.middlewares.use(createLocaleMiddleware(distRoot));
    }
  };
}

export default defineConfig({
  plugins: [react(), localeAssetsPlugin(), localeSpaFallback()]
});
