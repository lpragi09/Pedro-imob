import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function safeEqual(a: string, b: string) {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}

export async function GET(req: NextRequest) {
  const startedAt = Date.now();

  const expectedKey = process.env.CRON_SECRET;
  const providedKey = req.headers.get("x-cron-key") ?? "";

  if (!expectedKey) {
    return NextResponse.json(
      {
        ok: false,
        error: "Env CRON_SECRET não configurada.",
        timestamp: new Date().toISOString(),
      },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }

  if (!providedKey || !safeEqual(providedKey, expectedKey)) {
    return NextResponse.json(
      { ok: false, error: "Não autorizado.", timestamp: new Date().toISOString() },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Env do Supabase ausentes. Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.",
        timestamp: new Date().toISOString(),
      },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }

  const supabase = createClient(supabaseUrl, anonKey, {
    auth: { persistSession: false },
    global: { headers: { "X-Client-Info": "keep-alive-cron" } },
  });

  const { data, error } = await supabase.from("imoveis").select("id").limit(1);

  if (error) {
    return NextResponse.json(
      {
        ok: false,
        woke: false,
        error: error.message,
        timestamp: new Date().toISOString(),
        durationMs: Date.now() - startedAt,
      },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }

  return NextResponse.json(
    {
      ok: true,
      woke: true,
      table: "imoveis",
      sampleCount: Array.isArray(data) ? data.length : 0,
      timestamp: new Date().toISOString(),
      durationMs: Date.now() - startedAt,
    },
    { status: 200, headers: { "Cache-Control": "no-store" } }
  );
}

