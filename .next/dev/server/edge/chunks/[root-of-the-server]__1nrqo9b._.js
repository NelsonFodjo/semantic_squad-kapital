(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push(["chunks/[root-of-the-server]__1nrqo9b._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/semantic_squad-kapital/src/lib/supabase/middleware.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "updateSession",
    ()=>updateSession
]);
// ============================================================
// SUPABASE — session refresh, used by the root middleware.ts.
// ============================================================
// Middleware runs before every page. Two jobs here:
//   1. Refresh the login session so it does not silently expire
//   2. Send anonymous visitors away from the dashboard
//
// The logic lives in this file and the root middleware.ts just calls
// it, which keeps the Supabase details out of the app's front door.
var __TURBOPACK__imported__module__$5b$project$5d2f$semantic_squad$2d$kapital$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/semantic_squad-kapital/node_modules/@supabase/ssr/dist/module/index.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$semantic_squad$2d$kapital$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/semantic_squad-kapital/node_modules/@supabase/ssr/dist/module/createServerClient.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$semantic_squad$2d$kapital$2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/semantic_squad-kapital/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$semantic_squad$2d$kapital$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/semantic_squad-kapital/node_modules/next/dist/esm/server/web/spec-extension/response.js [middleware-edge] (ecmascript)");
;
;
/** URLs that require you to be logged in. */ const protectedPaths = [
    "/dashboard",
    "/onboarding"
];
async function updateSession(request) {
    // Start with a response that passes the request straight through.
    let response = __TURBOPACK__imported__module__$5b$project$5d2f$semantic_squad$2d$kapital$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next({
        request
    });
    // If Supabase is not configured yet, do nothing. This lets the
    // site run before anyone has created a project.
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$semantic_squad$2d$kapital$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["createServerClient"])(("TURBOPACK compile-time value", "https://pvwcicxjtlhqrdiaweuw.supabase.co"), ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2d2NpY3hqdGxocXJkaWF3ZXV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxNjM2NTcsImV4cCI6MjEwMDczOTY1N30.XWEr42XDBb1BPayeuyE7kNAzUZeOSBP3nXxXmMIrsXE"), {
        cookies: {
            getAll () {
                return request.cookies.getAll();
            },
            setAll (cookiesToSet) {
                // Write refreshed cookies onto both the request (so the page
                // being rendered sees them straight away) and the response
                // (so the browser stores them).
                cookiesToSet.forEach(({ name, value })=>request.cookies.set(name, value));
                response = __TURBOPACK__imported__module__$5b$project$5d2f$semantic_squad$2d$kapital$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next({
                    request
                });
                cookiesToSet.forEach(({ name, value, options })=>response.cookies.set(name, value, options));
            }
        }
    });
    // This call is the point of the middleware: it refreshes an expiring
    // token. Do not remove it, or users get logged out mid-session.
    const { data: { user } } = await supabase.auth.getUser();
    const path = request.nextUrl.pathname;
    const needsAuth = protectedPaths.some((prefix)=>path.startsWith(prefix));
    // Not logged in and asking for a private page: send them to login,
    // remembering where they wanted to go so we can return them after.
    if (needsAuth && !user) {
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = "/login";
        loginUrl.searchParams.set("next", path);
        return __TURBOPACK__imported__module__$5b$project$5d2f$semantic_squad$2d$kapital$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(loginUrl);
    }
    return response;
}
}),
"[project]/semantic_squad-kapital/middleware.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ============================================================
// MIDDLEWARE — runs before every matching request.
// ============================================================
// This file must sit at the project root (next to package.json), not
// inside src/app/. Next.js looks for it by name.
//
// All it does is hand off to the Supabase session refresher.
__turbopack_context__.s([
    "config",
    ()=>config,
    "middleware",
    ()=>middleware
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$semantic_squad$2d$kapital$2f$src$2f$lib$2f$supabase$2f$middleware$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/semantic_squad-kapital/src/lib/supabase/middleware.ts [middleware-edge] (ecmascript)");
;
async function middleware(request) {
    return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$semantic_squad$2d$kapital$2f$src$2f$lib$2f$supabase$2f$middleware$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["updateSession"])(request);
}
const config = {
    // Which URLs this runs on. The pattern skips static files and
    // images — running auth logic for every icon would be wasteful.
    //
    // (?!...) means "not followed by", so this reads as: match
    // everything EXCEPT these paths and file extensions.
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico)$).*)"
    ]
};
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__1nrqo9b._.js.map