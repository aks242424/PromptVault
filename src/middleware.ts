import { defineMiddleware } from "astro:middleware";
import { createServerClient, parseCookieHeader } from "@supabase/ssr";

export const onRequest = defineMiddleware(async (context, next) => {
  const pathname = context.url.pathname;

  if (pathname !== "/admin" && !pathname.startsWith("/admin/")) {
    return next();
  }

  const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
  const supabaseKey = import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return new Response("Server authentication is not configured.", {
      status: 500,
    });
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return parseCookieHeader(context.request.headers.get("Cookie") ?? "");
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          context.cookies.set(name, value, options);
        });
      },
    },
  });

  try {
    const result = await supabase.auth.getClaims();
    const claims = result?.data?.claims;
    const userId = claims?.sub;

    if (result?.error || !userId) {
      return context.redirect("/admin-login");
    }

    const { data: admin, error: adminError } = await supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (adminError || !admin) {
      return context.redirect("/admin-login?error=not-admin");
    }

    const response = await next();
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  } catch {
    return context.redirect("/admin-login");
  }
});
