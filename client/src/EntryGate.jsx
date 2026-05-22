import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import ElasticCursor from './ElasticCursor.jsx';
import { getLocaleCopy, getLocaleFromPath, getLocalePath } from './i18n';
import { ENTRY_APPROVED_KEY } from './entryGate.js';
import { installEntryGateCursorLock } from './hiddenCursor.js';

const LANGUAGE_CODES = ['en', 'ro', 'ru', 'es', 'de'];

const DEFAULT_LANGUAGE_NAMES = {
  en: 'ENGLISH',
  ro: 'ROMANIAN',
  ru: 'RUSSIAN',
  es: 'SPANISH',
  de: 'GERMAN'
};

const DEFAULT_GATE = {
  selectLanguage: 'SELECT LANGUAGE',
  ageQuestion: 'ARE YOU OVER 18?',
  informational: 'THIS WEBSITE IS STRICTLY INFORMATIONAL',
  noSale: 'UNDER NO CIRCUMSTANCES THIS PAGE ALLOWS THE SELL OF TOBACCO PRODUCTS.',
  yes: 'YES',
  no: 'NO',
  languageSelect: 'Select language',
  languageNames: DEFAULT_LANGUAGE_NAMES
};

const DESKTOP_CURSOR_QUERY = '(min-width: 901px)';

function useDesktopCursorEnabled() {
  const [enabled, setEnabled] = useState(() => window.matchMedia(DESKTOP_CURSOR_QUERY).matches);

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_CURSOR_QUERY);
    const sync = () => setEnabled(mediaQuery.matches);
    sync();
    mediaQuery.addEventListener('change', sync);
    return () => mediaQuery.removeEventListener('change', sync);
  }, []);

  return enabled;
}

function activateOnKey(event, onActivate) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    onActivate();
  }
}

function GateControl({ className = '', ariaLabel, ariaExpanded, ariaHasPopup, onActivate, children }) {
  return (
    <div
      role="button"
      tabIndex={0}
      className={`entry-gate-control ${className}`.trim()}
      aria-label={ariaLabel}
      aria-expanded={ariaExpanded}
      aria-haspopup={ariaHasPopup}
      onClick={onActivate}
      onKeyDown={(event) => activateOnKey(event, onActivate)}
    >
      {children}
    </div>
  );
}

function LanguageFlag({ code, label, className = '' }) {
  const [failed, setFailed] = useState(false);

  return (
    <span className={`lang-flag ${className}`.trim()} aria-hidden="true">
      {failed ? (
        <span className="lang-flag-placeholder" />
      ) : (
        <img
          src={`/language-selector/${code}.webp`}
          alt=""
          width={48}
          height={48}
          draggable={false}
          onError={() => setFailed(true)}
        />
      )}
      <span className="lang-flag-code">{label}</span>
    </span>
  );
}

function GateLanguageSelector({ language, onLanguageChange, languageSelectLabel, languageNames }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const labelFor = (code) => languageNames[code] ?? DEFAULT_LANGUAGE_NAMES[code] ?? code.toUpperCase();
  const activeLabel = labelFor(language);

  useEffect(() => {
    if (!open) return undefined;

    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={`lang-selector entry-gate-lang ${open ? 'is-open' : ''}`}>
      <GateControl
        className="lang-selector-trigger"
        ariaLabel={`Language: ${activeLabel}`}
        ariaExpanded={open}
        ariaHasPopup="listbox"
        onActivate={() => setOpen((value) => !value)}
      >
        <LanguageFlag code={language} label={activeLabel} />
        <span className="lang-selector-arrow" aria-hidden="true" />
      </GateControl>
      <ul className="lang-selector-menu" role="listbox" aria-label={languageSelectLabel}>
        {LANGUAGE_CODES.map((code) => (
          <li key={code} role="presentation">
            <GateControl
              className={code === language ? 'is-active' : ''}
              ariaLabel={labelFor(code)}
              onActivate={() => {
                onLanguageChange(code);
                setOpen(false);
              }}
            >
              <LanguageFlag code={code} label={labelFor(code)} />
            </GateControl>
          </li>
        ))}
      </ul>
    </div>
  );
}

function localePathsMatch(targetPath, currentPath, previewLocale, currentLocale) {
  if (previewLocale !== currentLocale) return false;
  if (targetPath === currentPath) return true;
  if (targetPath === '/' && (currentPath === '/' || currentPath === '/en' || currentPath === '/en/')) return true;
  return false;
}

export default function EntryGate({ onApproved }) {
  const [loaderDone, setLoaderDone] = useState(() => !document.getElementById('kaja-loader'));
  const [previewLocale, setPreviewLocale] = useState(() => getLocaleFromPath());
  const [ageActionsWidth, setAgeActionsWidth] = useState(null);
  const desktopCursor = useDesktopCursorEnabled();
  const ageQuestionRef = useRef(null);
  const gateRef = useRef(null);
  const gate = useMemo(() => ({
    ...DEFAULT_GATE,
    ...(getLocaleCopy(previewLocale).gate ?? {}),
    languageNames: {
      ...DEFAULT_LANGUAGE_NAMES,
      ...(getLocaleCopy(previewLocale).gate?.languageNames ?? {})
    }
  }), [previewLocale]);

  useEffect(() => {
    document.documentElement.lang = previewLocale;
  }, [previewLocale]);

  useLayoutEffect(() => {
    if (!loaderDone || !gateRef.current || !desktopCursor) return undefined;
    return installEntryGateCursorLock(gateRef.current);
  }, [loaderDone, previewLocale, desktopCursor]);

  useLayoutEffect(() => {
    const syncAgeActionsWidth = () => {
      if (!ageQuestionRef.current) return;
      setAgeActionsWidth(ageQuestionRef.current.offsetWidth);
    };

    syncAgeActionsWidth();
    window.addEventListener('resize', syncAgeActionsWidth);
    return () => window.removeEventListener('resize', syncAgeActionsWidth);
  }, [gate.ageQuestion, previewLocale]);

  useEffect(() => {
    if (loaderDone) return undefined;

    const finish = () => setLoaderDone(true);
    window.addEventListener('kaja-loader-finished', finish);
    if (!document.getElementById('kaja-loader')) finish();

    return () => window.removeEventListener('kaja-loader-finished', finish);
  }, [loaderDone]);

  const handleYes = () => {
    sessionStorage.setItem(ENTRY_APPROVED_KEY, '1');

    const targetPath = getLocalePath(previewLocale);
    const currentPath = window.location.pathname;
    const currentLocale = getLocaleFromPath();

    if (!localePathsMatch(targetPath, currentPath, previewLocale, currentLocale)) {
      window.location.assign(targetPath);
      return;
    }

    onApproved();
  };

  const handleNo = () => {
    window.location.href = 'https://www.google.com/';
  };

  if (!loaderDone) return null;

  return (
    <div
      ref={gateRef}
      className="entry-gate"
      role="dialog"
      aria-modal="true"
      aria-labelledby="entry-gate-title"
    >
      {desktopCursor ? <ElasticCursor /> : null}
      <div className="entry-gate-panel">
        <div className="entry-gate-language-block">
          <h1 id="entry-gate-title" className="entry-gate-title">{gate.selectLanguage}</h1>
          <GateLanguageSelector
            language={previewLocale}
            onLanguageChange={setPreviewLocale}
            languageSelectLabel={gate.languageSelect ?? DEFAULT_GATE.languageSelect}
            languageNames={gate.languageNames}
          />
        </div>

        <div className="entry-gate-age-block">
          <p ref={ageQuestionRef} className="entry-gate-age">{gate.ageQuestion}</p>
          <p className="entry-gate-note">{gate.informational}</p>
          <p className="entry-gate-note">{gate.noSale}</p>

          <div
            className="entry-gate-actions"
            style={ageActionsWidth ? { width: `${ageActionsWidth}px` } : undefined}
          >
            <GateControl
              className="entry-gate-button entry-gate-button-yes"
              ariaLabel={gate.yes}
              onActivate={handleYes}
            >
              {gate.yes}
            </GateControl>
            <GateControl
              className="entry-gate-button entry-gate-button-no"
              ariaLabel={gate.no}
              onActivate={handleNo}
            >
              {gate.no}
            </GateControl>
          </div>
        </div>
      </div>
    </div>
  );
}
