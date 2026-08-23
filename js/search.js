/* ==========================================================================
   SEARCH
   Opens the overlay, filters BR.searchIndex as you type, renders results.
   The list it searches lives in js/search-index.js — edit that one to add
   entries, this file to change how searching behaves.
   ========================================================================== */

(function (BR) {
  "use strict";

  var openBtn = document.getElementById("search-open-btn");
  var overlay = document.getElementById("search-overlay");
  var closeBtn = document.getElementById("search-close-btn");
  var input = document.getElementById("search-input");
  var resultsEl = document.getElementById("search-results");
  var index = BR.searchIndex || [];

  /* Bail out quietly if the markup isn't on this page rather than throwing */
  if (!openBtn || !overlay || !input || !resultsEl) return;

  function openSearch() {
    overlay.hidden = false;
    input.value = "";
    resultsEl.innerHTML = "";
    input.focus();
  }

  function closeSearch() {
    overlay.hidden = true;
    /* Send focus back to the button that opened it, so keyboard users
       don't get dumped at the top of the document. */
    openBtn.focus();
  }

  function render(matches, rawQuery) {
    resultsEl.innerHTML = "";

    if (!matches.length) {
      var empty = document.createElement("li");
      empty.className = "search-empty";
      /* textContent, not innerHTML — the query is whatever the visitor
         typed, and this makes it impossible for it to run as markup. */
      empty.textContent = 'No results for "' + rawQuery + '".';
      resultsEl.appendChild(empty);
      return;
    }

    matches.forEach(function (item) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      var label = document.createElement("span");

      a.href = item.url;
      label.className = "search-result-section";
      label.textContent = item.section;

      a.appendChild(document.createTextNode(item.title));
      a.appendChild(label);
      li.appendChild(a);
      resultsEl.appendChild(li);
    });
  }

  openBtn.addEventListener("click", openSearch);

  if (closeBtn) {
    closeBtn.addEventListener("click", closeSearch);
  }

  /* Clicking the dimmed area closes; clicking the panel itself must not.
     e.target is the deepest element clicked, so this is only true for the
     backdrop. */
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) closeSearch();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !overlay.hidden) closeSearch();
  });

  /* ------------------------------------------------------------------
     Matching

     The old version looked for the whole typed phrase as one exact chunk,
     so "best builds for war" could never match "Best Build for Warrior".
     This splits the query into words and requires each one to appear
     SOMEWHERE in the entry, in any order — the equivalent of chaining
     LIKE %word% AND LIKE %word% in SQL.
     ------------------------------------------------------------------ */

  /* Filler words are ignored so they can't sink an otherwise good match —
     searching "best builds for war" shouldn't fail just because an entry
     doesn't happen to contain the word "for". */
  var STOP_WORDS = Object.create(null);
  "a an and are as at be by for from in is it of on or the to with".split(" ")
    .forEach(function (w) { STOP_WORDS[w] = true; });

  var MAX_RESULTS = 12;

  function normalize(text) {
    return String(text == null ? "" : text).toLowerCase();
  }

  /* Splits text into bare words, dropping punctuation and symbols */
  function tokenize(text) {
    return normalize(text).split(/[^a-z0-9]+/).filter(Boolean);
  }

  /* Does one search word appear in this text? */
  function hasToken(haystack, haystackWords, token) {
    /* Plain substring — this is the %like% part. Covers "war" matching
       inside "warrior", and "build" inside "builds". */
    if (haystack.indexOf(token) !== -1) return true;

    /* The reverse case: the typed word is LONGER than the stored one, e.g.
       typing "builds" when the content says "build". Only for words of 3+
       characters, so short fragments can't match half the site. */
    for (var i = 0; i < haystackWords.length; i++) {
      var word = haystackWords[i];
      if (word.length >= 3 && token.indexOf(word) === 0) return true;
    }
    return false;
  }

  /* Returns 0 for "no match", higher numbers for better matches, so the
     most relevant results can be shown first. */
  function scoreItem(item, tokens, rawQuery) {
    var title = normalize(item.title);
    var haystack = title + " " + normalize(item.section) + " " + normalize(item.keywords);
    var titleWords = tokenize(title);
    var haystackWords = tokenize(haystack);
    var score = 0;

    /* The exact phrase typed, found verbatim — the strongest signal */
    if (title.indexOf(rawQuery) !== -1) score += 50;
    else if (haystack.indexOf(rawQuery) !== -1) score += 20;

    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];
      if (!hasToken(haystack, haystackWords, token)) {
        return 0; /* every word must appear somewhere — this is the AND */
      }
      /* A hit in the title counts for more than one buried in keywords */
      score += hasToken(title, titleWords, token) ? 6 : 2;
    }

    return score;
  }

  input.addEventListener("input", function () {
    var raw = input.value.trim();
    var query = normalize(raw);

    if (!query) {
      resultsEl.innerHTML = "";
      return;
    }

    var tokens = tokenize(query).filter(function (t) { return !STOP_WORDS[t]; });

    /* If someone types only filler words ("the", "of"), fall back to the
       raw words so the search still does something sensible. */
    if (!tokens.length) tokens = tokenize(query);
    if (!tokens.length) {
      resultsEl.innerHTML = "";
      return;
    }

    var matches = index
      .map(function (item) {
        return { item: item, score: scoreItem(item, tokens, query) };
      })
      .filter(function (row) { return row.score > 0; })
      .sort(function (a, b) { return b.score - a.score; })
      .slice(0, MAX_RESULTS)
      .map(function (row) { return row.item; });

    render(matches, raw);
  });
})(window.BR);
