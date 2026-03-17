import type { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  const userId = searchParams.get("userId");
  
  if (!userId) {
    return new Response('Error', { status: 400 });
  }
  
  const body = await request.json();
  if (!body) {
    return new Response('Error', { status: 400 });
  }
  const data = body;
  
  const name = body.nombre;
  const dateTime = body.fechaHora;
  const city = body.ciudad;
  const description = body.descripcion;
  try {
    await prisma.user.findUnique({
                                   where: {
                                     id: userId,
                                   }
                                 });
    // NOTE(erb): trabajar con datos
    await prisma.alert.create({
                                data: {
                                  title: name,
                                  dateTime,
                                  city,
                                  description,
                                  authorId: userId,
                                },
                              });
    
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (e) {
    // NOTE(erb): error
    console.log("SERVER ERROR: ", e);
    return new Response('Error', { status: 400 });
  }
}