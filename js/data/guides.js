/* ==========================================================================
   GUIDE DATA
   Feeds the build cards and the video list on guides.html.

   The "Procs & Mechanics" writing on that page is prose, not records, so it
   stays in guides.html as normal HTML.

   ---------------------------------------------------------------------------
   builds   title + body, shown as cards
   videos   title, and either:
              youtubeId — the code after "v=" in a YouTube URL, which
                          embeds the player directly, or
              url       — a plain link, shown as "Watch on YouTube"
            With neither, the card shows a placeholder box.
   ---------------------------------------------------------------------------
   ========================================================================== */

window.BR = window.BR || {};
window.BR.data = window.BR.data || {};

window.BR.data.guides = {

  /* ---------- Replace with your real builds ---------- */
  builds: [
    { title: "Placeholder Class 1", body: "Placeholder recommended build and gear notes." },
    { title: "Placeholder Class 2", body: "Placeholder recommended build and gear notes." },
    { title: "Placeholder Class 3", body: "Placeholder recommended build and gear notes." }
  ],

  /* ---------- Replace with your real videos ----------
     Example with a real embed:
       { title: "How to proc Glaive", youtubeId: "dQw4w9WgXcQ" }        */
  videos: [
    { title: "Best Build for Warrior", youtubeId: "G50vEW-hFKU" },
    { title: "Arcane Legends Rogue Skills 2026", youtubeId: "VAz58Q4LkY0" },
    { title: "Best Skills, Loadout & Pets for Warrior Builds", youtubeId: "cXJgOpS7KFY" }
  ]

};
