import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getHeader(req: Request, name: string) {
  return req.headers.get(name) ?? req.headers.get(name.toLowerCase()) ?? "";
}

export async function GET(req: Request) {
  const startedAt = Date.now();

  const expectedKey = process.env.CRON_SECRET;
  const providedKey = getHeader(req, "x-cron-key");

  if (!expectedKey) {
    return NextResponse.json(
      {
        ok: false,
        error: "Env CRON_SECRET não configurada.",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }

  if (!providedKey || providedKey !== expectedKey) {
    return NextResponse.json(
      {
        ok: false,
        error: "Não autorizado.",
        timestamp: new Date().toISOString(),
      },
      { status: 401 }
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
      { status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, anonKey, {
    auth: { persistSession: false },
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
      { status: 500 }
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
    { status: 200 }
  );
}

import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";

function safeEqual(a: string, b: string) {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}

export async function GET(req: NextRequest) {
  const cronKey = process.env.CRON_KEY;
  const providedKey = req.headers.get("x-cron-key") ?? "";

  if (!cronKey) {
    return NextResponse.json(
      { ok: false, error: "CRON_KEY não configurada no servidor." },
      { status: 500 }
    );
  }

  if (!providedKey || !safeEqual(providedKey, cronKey)) {
    return NextResponse.json({ ok: false, error: "Não autorizado." }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Variáveis do Supabase ausentes (NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY/NEXT_PUBLIC_SUPABASE_ANON_KEY).",
      },
      { status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
    global: { headers: { "X-Client-Info": "keep-alive-cron" } },
  });

  const startedAt = Date.now();
  const { data, error } = await supabase.from("imoveis").select("id").limit(1);

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message, timestamp: new Date().toISOString() },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      ok: true,
      wokeUp: true,
      timestamp: new Date().toISOString(),
      durationMs: Date.now() - startedAt,
      sampleCount: Array.isArray(data) ? data.length : 0,
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}

