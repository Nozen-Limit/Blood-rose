"use client";

import { useState } from "react";
import { useDiscordInvite } from "./SiteSettings";

/* Copy-to-clipboard with the same fallback the static site's clipboard.js
   carried: the modern API is unavailable on non-https origins, so the old
   hidden-textarea trick stays as a backstop. */
function copyText(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text);
  }
  return new Promise((resolve, reject) => {
    const temp = document.createElement("textarea");
    temp.value = text;
    temp.style.position = "fixed";
    temp.style.opacity = "0";
    document.body.appendChild(temp);
    temp.select();
    try {
      document.execCommand("copy");
      resolve();
    } catch {
      reject();
    } finally {
      document.body.removeChild(temp);
    }
  });
}

export default function Footer() {
  const discordInvite = useDiscordInvite();
  const [copied, setCopied] = useState(false);

  return (
    <footer className="site-footer">
      <div className="footer-discord">
        <a href={discordInvite} className="btn btn-outline">
          Join our Discord
        </a>
        <button
          type="button"
          className={`copy-link-btn${copied ? " is-copied" : ""}`}
          onClick={() => {
            copyText(discordInvite).then(
              () => {
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              },
              () => {
                /* Clipboard genuinely unavailable — say nothing rather than
                   claiming a copy that did not happen. */
              }
            );
          }}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M5 15V5a2 2 0 0 1 2-2h10" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
          <span className="copy-link-label">{copied ? "Copied!" : "Copy link"}</span>
        </button>
      </div>
    </footer>
  );
}
