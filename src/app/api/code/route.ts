import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const codeSnippet = await prisma.code.create({
      data: {
        code: body.code,
        roomId: body.roomId,
        language: body.language,
      },
    });

    if (!codeSnippet) {
      return NextResponse.json(codeSnippet);
    }

    return NextResponse.json({ codeSnippet }, { status: 200 });
  } catch (err) {
    return NextResponse.json({
      err: err,
    });
  }
}
