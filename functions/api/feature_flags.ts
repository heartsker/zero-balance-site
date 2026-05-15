// Cloudflare Pages Function for `/api/feature_flags`.
// Returns a manually-curated JSON map of feature flags consumed by the app.
// Edit the FLAGS object below and redeploy to change values.

type CloudflarePagesFunction = () => Response;

const FLAGS = {
  home_screen_region_change_warning: true,
  home_screen_social_proof: true,
} as const;

export const onRequestGet: CloudflarePagesFunction = () => {
  return new Response(JSON.stringify(FLAGS), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=300',
      'Access-Control-Allow-Origin': '*',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
};
