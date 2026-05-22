(() => {
  function localeHomePath() {
    const match = window.location.pathname.match(/^\/(ro|ru|es|de)(?:\/|$)/);
    return match ? `/${match[1]}/` : '/';
  }

  function localeCataloguePath() {
    if (window.KajaCatalogueSlug) {
      return window.KajaCatalogueSlug.getCataloguePath(window.KajaCatalogueSlug.getLocaleFromPath());
    }

    const match = window.location.pathname.match(/^\/(ro|ru|es|de)(?:\/|$)/);
    return match ? `/${match[1]}/catalogue` : '/catalogue';
  }

  function localeMerchPath() {
    if (window.KajaMerchSlug) {
      return window.KajaMerchSlug.getMerchPath(window.KajaMerchSlug.getLocaleFromPath());
    }

    const match = window.location.pathname.match(/^\/(ro|ru|es|de)(?:\/|$)/);
    return match ? `/${match[1]}/merch` : '/merch';
  }

  document.querySelectorAll('[data-locale-home]').forEach((link) => {
    link.href = localeHomePath();
  });

  document.querySelectorAll('[data-locale-catalogue]').forEach((link) => {
    link.href = localeCataloguePath();
  });

  document.querySelectorAll('[data-locale-merch]').forEach((link) => {
    link.href = localeMerchPath();
  });
})();
