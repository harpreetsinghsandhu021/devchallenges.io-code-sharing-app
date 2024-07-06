import prisma from "@/lib/prisma";
import axios from "axios";
import { nanoid } from "nanoid";
import redirect from "next/router";

export async function handleShareCode(
  codeValue: string,
  language: string,
  nanoId: string
) {
  try {
    const sendReq = await axios.post("/api/code", {
      code: codeValue,
      roomId: nanoId,
      language,
    });

    return sendReq.status;
  } catch (error) {}
}
