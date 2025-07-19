// app/api/artists/route.ts
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get("q")

  if (!query) {
    return NextResponse.json({ error: "Missing query parameter" }, { status: 400 })
  }

  try {
    const res = await fetch(`https://www.theaudiodb.com/api/v1/json/2/search.php?s=${encodeURIComponent(query)}`)

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch from TheAudioDB" }, { status: 500 })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: "Server Error", detail: (err as Error).message }, { status: 500 })
  }
}
