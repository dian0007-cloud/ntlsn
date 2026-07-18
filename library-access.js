/*
 * NTLSN — "Get it through your library" — client-side DOI link-rewriter.
 * ----------------------------------------------------------------------------
 * Pure browser JS, no dependencies, stores NOTHING but the chosen institution id
 * in localStorage. NTLSN never sees a credential: this rewrites a DOI link so it
 * points at the READER'S OWN institution's resolver (an OpenAthens redirector or
 * an EZproxy /login?url= front door), which then asks the reader to authenticate
 * with their own library. It is link-routing over the reader's own entitlements —
 * no publisher partnership exists or is implied.
 *
 * Data:  fetched at runtime from /data/library-resolvers.json (CC0), or primed
 *        in-memory with LibraryAccess.useTable(table) (used by the local demo,
 *        where fetch() of a sibling file is blocked by the browser).
 *
 * Two URL shapes (everything in the AU sector collapses to these):
 *   openathens-redirector : https://go.openathens.net/redirector/{org}?url={enc}
 *   ezproxy-login-url     : {host}/login?url={enc}   (UNSW uses ?qurl=)
 */
(function (global) {
  "use strict";
  var STORE_KEY = "ntlsn-library-institution";
  var DATA_URL = "/data/library-resolvers.json";
  var EVT = "ntlsn:institution";
  var _tablePromise = null;

  // Prime the table in-memory (no fetch). Returns the module for chaining.
  function useTable(table) {
    _tablePromise = Promise.resolve(table);
    return api;
  }

  function loadTable() {
    if (_tablePromise) return _tablePromise;
    _tablePromise = fetch(DATA_URL, { cache: "force-cache" }).then(function (r) {
      if (!r.ok) throw new Error("library-resolvers.json HTTP " + r.status);
      return r.json();
    });
    return _tablePromise;
  }

  function chosen() { return localStorage.getItem(STORE_KEY) || ""; }

  function setInstitution(id) {
    if (id) localStorage.setItem(STORE_KEY, id);
    else localStorage.removeItem(STORE_KEY);
    document.dispatchEvent(new CustomEvent(EVT, { detail: { id: id } }));
    return id;
  }

  function findRow(table, id) {
    var rows = (table && table.rows) || [];
    for (var i = 0; i < rows.length; i++) if (rows[i].id === id) return rows[i];
    return null;
  }

  // Build the library-routed URL for a target (DOI or bare URL) via one resolver row.
  // Returns null when the institution has no usable pattern (e.g. none-found).
  function route(targetUrl, row) {
    if (!row || !row.pattern || row.patternType === "none-found") return null;
    return row.pattern + encodeURIComponent(targetUrl);
  }

  // Promise the routed URL for `targetUrl` under the chosen (or given) institution.
  // Resolves null if nothing is chosen or no pattern exists for it.
  function resolve(targetUrl, institutionId) {
    var id = institutionId || chosen();
    if (!id) return Promise.resolve(null);
    return loadTable().then(function (t) { return route(targetUrl, findRow(t, id)); });
  }

  // Populate a <select> with institutions and bind it to the stored choice.
  // "Region-gate": every row is an Australian institution, so the list is AU-only
  // by construction; a future multi-region table would filter here.
  function renderPicker(selectEl) {
    return loadTable().then(function (t) {
      var rows = (t.rows || []).slice().sort(function (a, b) { return a.name < b.name ? -1 : 1; });
      selectEl.innerHTML = "";
      var blank = document.createElement("option");
      blank.value = ""; blank.textContent = "Choose your university…";
      selectEl.appendChild(blank);
      rows.forEach(function (r) {
        var o = document.createElement("option");
        o.value = r.id;
        // Honest-confidence labelling: rows the research pass could not fully verify
        // (VU's odd http+port door, UNE's on-network-only host, …) say so up front
        // rather than silently maybe-failing after the reader has chosen them.
        var suffix = "";
        if (r.patternType === "none-found") suffix = " (no link-rewriting — contact your library)";
        else if (r.confidence && r.confidence !== "high") suffix = " (pattern unverified — may need library help)";
        o.textContent = r.name + suffix;
        selectEl.appendChild(o);
      });
      selectEl.value = chosen();
      selectEl.addEventListener("change", function () { setInstitution(selectEl.value); });
      return selectEl;
    });
  }

  // Decorate every DOI link under `root` with a "Get it through your library →" link
  // that re-renders when the visitor changes institution. A DOI link is any <a> whose
  // href contains "doi.org".
  function decorate(root) {
    root = root || document;
    return loadTable().then(function (t) {
      var byId = {}; (t.rows || []).forEach(function (r) { byId[r.id] = r; });
      var links = root.querySelectorAll('a[href*="doi.org"]');
      Array.prototype.forEach.call(links, function (a) {
        if (a.dataset.libraryDecorated) return;
        a.dataset.libraryDecorated = "1";
        var span = document.createElement("span");
        span.className = "ntlsn-library-door";
        function render() {
          span.innerHTML = "";
          var row = byId[chosen()];
          var href = row ? route(a.href, row) : null;
          if (!href) return;
          var door = document.createElement("a");
          door.href = href;
          door.className = "ntlsn-library-link";
          door.rel = "noopener noreferrer";
          door.target = "_blank";
          door.textContent = "Get it through your library →";
          span.appendChild(door);
        }
        render();
        document.addEventListener(EVT, render);
        a.parentNode.insertBefore(span, a.nextSibling);
      });
    });
  }

  var api = {
    STORE_KEY: STORE_KEY,
    DATA_URL: DATA_URL,
    useTable: useTable,
    loadTable: loadTable,
    chosen: chosen,
    setInstitution: setInstitution,
    route: route,
    resolve: resolve,
    renderPicker: renderPicker,
    decorate: decorate,
  };
  global.LibraryAccess = api;
  return api;
})(typeof window !== "undefined" ? window : this);
