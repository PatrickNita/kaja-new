import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.set('strict routing', true);
const PORT = process.env.PORT || 5050;
const PREFIXED_LOCALES = ['ro', 'ru', 'es', 'de'];
const LOCALIZED_PAGES = ['catalogue', 'merch'];
const prefixedLocalePattern = new RegExp(`^/(${PREFIXED_LOCALES.join('|')})/?$`);
const localizedSubpagePattern = new RegExp(`^/(${PREFIXED_LOCALES.join('|')})/(catalogue|merch)/?$`);
const englishSubpagePattern = new RegExp(`^/(catalogue|merch)/?$`);
const localizedCatalogueProductPattern = new RegExp(`^/(${PREFIXED_LOCALES.join('|')})/catalogue/([^/]+)/?$`);
const englishCatalogueProductPattern = /^\/catalogue\/([^/]+)\/?$/;
const localizedMerchProductPattern = new RegExp(`^/(${PREFIXED_LOCALES.join('|')})/merch/([^/]+)/?$`);
const englishMerchProductPattern = /^\/merch\/([^/]+)\/?$/;
const RESERVED_CATALOGUE_SLUGS = new Set(['products', 'product']);
const RESERVED_MERCH_SLUGS = new Set(['products', 'product']);

app.use(cors());
app.use(express.json());

app.get('/api/product', (_req, res) => {
  res.json({
    brand: 'KAJA',
    title: 'A product presentation experience',
    description: 'Controlled scroll, cinematic product reveals and an elastic custom cursor.',
    sections: 6
  });
});

const clientDist = path.resolve(__dirname, '../client/dist');
const indexHtml = path.join(clientDist, 'index.html');

function sendSubpage(page, res) {
  const pageHtml = path.join(clientDist, page, 'index.html');
  if (!existsSync(pageHtml)) {
    res.status(404).send('Subpage not found');
    return;
  }

  res.sendFile(pageHtml);
}

function sendCatalogueProductPage(res) {
  const productHtml = path.join(clientDist, 'catalogue', 'product', 'index.html');
  if (!existsSync(productHtml)) {
    res.status(404).send('Product page not found');
    return;
  }

  res.sendFile(productHtml);
}

function sendMerchProductPage(res) {
  const productHtml = path.join(clientDist, 'merch', 'product', 'index.html');
  if (!existsSync(productHtml)) {
    res.status(404).send('Merch product page not found');
    return;
  }

  res.sendFile(productHtml);
}

function isMerchProductPath(pathname) {
  const localizedProductMatch = pathname.match(localizedMerchProductPattern);
  if (localizedProductMatch && !RESERVED_MERCH_SLUGS.has(localizedProductMatch[2])) {
    return true;
  }

  const englishProductMatch = pathname.match(englishMerchProductPattern);
  return Boolean(englishProductMatch && !RESERVED_MERCH_SLUGS.has(englishProductMatch[1]));
}

function isCatalogueProductPath(pathname) {
  const localizedProductMatch = pathname.match(localizedCatalogueProductPattern);
  if (localizedProductMatch && !RESERVED_CATALOGUE_SLUGS.has(localizedProductMatch[2])) {
    return true;
  }

  const englishProductMatch = pathname.match(englishCatalogueProductPattern);
  return Boolean(englishProductMatch && !RESERVED_CATALOGUE_SLUGS.has(englishProductMatch[1]));
}

function handleSubpageRequest(req, res, next) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    next();
    return;
  }

  if (isMerchProductPath(req.path)) {
    sendMerchProductPage(res);
    return;
  }

  if (isCatalogueProductPath(req.path)) {
    sendCatalogueProductPage(res);
    return;
  }

  const localizedSubpageMatch = req.path.match(localizedSubpagePattern);
  if (localizedSubpageMatch) {
    sendSubpage(localizedSubpageMatch[2], res);
    return;
  }

  const englishSubpageMatch = req.path.match(englishSubpagePattern);
  if (englishSubpageMatch) {
    sendSubpage(englishSubpageMatch[1], res);
    return;
  }

  next();
}

app.get(/^\/(?:ro|ru|es|de)\/merch\/[^/]+\/?$/, (req, res, next) => {
  if (isMerchProductPath(req.path)) {
    sendMerchProductPage(res);
    return;
  }
  next();
});

app.get(/^\/merch\/[^/]+\/?$/, (req, res, next) => {
  if (isMerchProductPath(req.path)) {
    sendMerchProductPage(res);
    return;
  }
  next();
});

app.get(/^\/(?:ro|ru|es|de)\/catalogue\/[^/]+\/?$/, (req, res, next) => {
  if (isCatalogueProductPath(req.path)) {
    sendCatalogueProductPage(res);
    return;
  }
  next();
});

app.get(/^\/catalogue\/[^/]+\/?$/, (req, res, next) => {
  if (isCatalogueProductPath(req.path)) {
    sendCatalogueProductPage(res);
    return;
  }
  next();
});

app.use(handleSubpageRequest);

app.get('/', (_req, res) => {
  res.sendFile(indexHtml);
});

app.get('/en', (_req, res) => {
  res.redirect(301, '/');
});

app.get('/en/', (_req, res) => {
  res.redirect(301, '/');
});

LOCALIZED_PAGES.forEach((page) => {
  app.get(`/en/${page}`, (_req, res) => {
    res.redirect(301, `/${page}`);
  });

  app.get(`/en/${page}/`, (_req, res) => {
    res.redirect(301, `/${page}`);
  });
});

PREFIXED_LOCALES.forEach((locale) => {
  app.get(`/${locale}/`, (_req, res) => {
    res.sendFile(indexHtml);
  });

  app.get(`/${locale}`, (_req, res) => {
    res.redirect(301, `/${locale}/`);
  });
});

app.use(express.static(clientDist, { index: false }));

app.use((req, res) => {
  if (prefixedLocalePattern.test(req.path)) {
    res.sendFile(indexHtml);
    return;
  }

  res.sendFile(indexHtml);
});

app.listen(PORT, () => {
  console.log(`KAJA server running on http://localhost:${PORT}`);
});
