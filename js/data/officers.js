/* ==========================================================================
   OFFICER DATA
   The officer cards on index.html are built from this list.

   ---------------------------------------------------------------------------
   ORDER
   Cards appear in the order written here. The priority officers are first,
   then Averith, then everyone else alphabetically.

   TO ADD AN OFFICER
   Copy a block, change the words between the quotes, keep the comma.

     name     In-game name
     rank     ONLY "Guild Master" or "Officer" — no other titles.
              Exactly one person should be Guild Master; they're pulled out
              automatically and shown in their own card above everyone else,
              wherever they appear in this list.
     note     One line shown on the card. Optional.
     avatar   Path to their picture, e.g. "images/officers/joudc.jpg"
              Leave as "" for the grey silhouette placeholder.
     details  Credentials shown on hover / tap. Each item is one row.
              Optional — a card with no details and no socials simply
              doesn't open.
     socials  Their links, also shown on hover / tap. Optional.

   SOCIALS
     platform  discord | youtube | facebook | instagram | tiktok | twitch | x
               Anything else falls back to a generic link icon.
     url       The link. LEAVE IT OUT for things that aren't clickable
               (a Discord username), and it renders as plain text instead
               of a link that goes nowhere.
     label     What's shown. Defaults to the platform name if omitted —
               use it for handles, e.g. "@bloodrose".

   Example of a fully filled-in officer:

     {
       name: "Joudc",
       rank: "Officer",
       note: "Runs the Tuesday elite squad.",
       avatar: "images/officers/joudc.jpg",
       details: [ { label: "Class", value: "Warrior" } ],
       socials: [ { platform: "discord", label: "joudc" } ]
     },

   ONLY ADD SOMEONE'S ACCOUNTS WITH THEIR PERMISSION. This page is public,
   so anything here can be seen and contacted by anyone.
   ---------------------------------------------------------------------------
   ========================================================================== */

window.BR = window.BR || {};
window.BR.data = window.BR.data || {};

window.BR.data.officers = [

  /* ---------- Guild Master ----------
     Pulled out of the list automatically and shown in the featured card
     above the carousel. Only one person should have this rank. */

  { name: "Queenni",     rank: "Guild Master", avatar: "" },

  /* ---------- Priority officers ---------- */

  { name: "Jafaarrasta", rank: "Officer", avatar: "" },
  { name: "Joudc",       rank: "Officer", avatar: "" },
  { name: "Deplete",     rank: "Officer", avatar: "" },
  { name: "Josogen",     rank: "Officer", avatar: "" },
  { name: "Diiiios",     rank: "Officer", avatar: "" },
  { name: "Reloss",      rank: "Officer", avatar: "" },
  { name: "Reaumur",     rank: "Officer", avatar: "" },
  { name: "Gyah",        rank: "Officer", avatar: "" },

  /* ---------- Averith (wasn't in the recording) ---------- */

  { name: "Averith",     rank: "Officer", avatar: "" },

  /* ---------- Next by seniority and activity ---------- */

  { name: "Optommy",     rank: "Officer", avatar: "" },
  { name: "Opmar",       rank: "Officer", avatar: "" },
  { name: "Mvgicmike",   rank: "Officer", avatar: "" },
  { name: "Ohsosad",     rank: "Officer", avatar: "" },

  /* ---------- Everyone else, alphabetically ---------- */

  { name: "Aminmahdi",   rank: "Officer", avatar: "" },
  { name: "Bigmeatshield", rank: "Officer", avatar: "" },
  { name: "Djorz",       rank: "Officer", avatar: "" },
  { name: "Dwellz",      rank: "Officer", avatar: "" },
  { name: "Hienax",      rank: "Officer", avatar: "" },
  { name: "Lunariptide", rank: "Officer", avatar: "" },
  { name: "Opflux",      rank: "Officer", avatar: "" },
  { name: "Poteca",      rank: "Officer", avatar: "" },
  { name: "Qtorque",     rank: "Officer", avatar: "" },
  { name: "Soundofpopo", rank: "Officer", avatar: "" },
  { name: "Toon",        rank: "Officer", avatar: "" },
  { name: "Upow",        rank: "Officer", avatar: "" },
  { name: "Xasmn",       rank: "Officer", avatar: "" },
  { name: "Zeanedrase",  rank: "Officer", avatar: "" }

];
