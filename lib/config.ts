// Central site config — change these via Vercel env vars, no code deploy needed.

export const SITE_CONFIG = {
  /** Max number of Founding memberships available. */
  foundingCapacity: parseInt(process.env.FOUNDING_CAPACITY ?? "500"),
  /** Months before an article becomes paid-only (archive lock). */
  archiveLockMonths: parseInt(process.env.ARCHIVE_LOCK_MONTHS ?? "6"),
  /** Ghost(Pro) URL */
  ghostUrl: process.env.GHOST_URL ?? "https://ww2-and-all-that.ghost.io",
  /** Ghost portal signup URL */
  ghostPortalSignup: `${process.env.GHOST_URL ?? "https://ww2-and-all-that.ghost.io"}/#/portal/signup`,
  ghostPortalPaid: `${process.env.GHOST_URL ?? "https://ww2-and-all-that.ghost.io"}/#/portal/signup/monthly`,
  ghostPortalFounding: `${process.env.GHOST_URL ?? "https://ww2-and-all-that.ghost.io"}/#/portal/signup/yearly`,
} as const;
