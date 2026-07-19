/**
 * Flight Chalker — subscription feature flag
 * ---------------------------------------------------
 * Single on/off switch for the whole Premium/subscription system.
 *
 * SUBSCRIPTIONS_ENABLED = false  → everyone gets full access to everything
 *   (Training Zone included). The premium gate, tier lookups and /upgrade
 *   page are effectively dormant — nobody sees a paywall, nothing is
 *   charged, nothing blocks testing. This is the current setting.
 *
 * SUBSCRIPTIONS_ENABLED = true   → the Training Zone gate in
 *   training/index.html enforces subscription_tier again, and the
 *   "Premium"/upgrade prompts become reachable through normal navigation.
 *
 * Flip this one value when you're ready to turn subscriptions back on —
 * no other file needs to change. Every gated page loads this file first.
 */
const SUBSCRIPTIONS_ENABLED = false;
