// Cloudflare Turnstile configuration
// Turnstile provides invisible bot protection with privacy-first design
// 
// PRODUCTION SETUP:
// ========================================
// ✅ Site Key configured below (public - safe to commit)
// ✅ Secret Key must be added to Supabase Dashboard:
//    - Go to: Supabase Dashboard → Authentication → Bot Protection
//    - Enable "Cloudflare Turnstile protection"
//    - Add your Turnstile secret key
//    - Configure for "Sign up" and "Sign in" actions
// ✅ Test thoroughly before going live!
//
// Cloudflare Turnstile site key (public)
export const TURNSTILE_SITE_KEY = "0x4AAAAAAB9h7tDPrccVkdmG";

// For more info: https://dash.cloudflare.com/turnstile
