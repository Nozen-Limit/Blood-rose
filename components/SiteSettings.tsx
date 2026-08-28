"use client";

/* ==========================================================================
   SITE SETTINGS CONTEXT
   The Discord invite is read once, on the server, in the root layout, and
   handed to every client component that needs it through this context.

   Why not let each component fetch it: the invite appears in the nav, the
   hero, the footer, the footer's copy button and the phone-only sticky bar.
   Five independent fetches would be five chances to disagree, and four
   wasted round trips.
   ========================================================================== */

import { createContext, useContext, type ReactNode } from "react";
import { DISCORD_INVITE } from "@/lib/site";

const Ctx = createContext<string>(DISCORD_INVITE);

/** The live Discord invite, as set in the admin's Settings page. */
export const useDiscordInvite = () => useContext(Ctx);

export function SiteSettingsProvider({
  discordInvite,
  children,
}: {
  discordInvite: string;
  children: ReactNode;
}) {
  return <Ctx.Provider value={discordInvite}>{children}</Ctx.Provider>;
}
