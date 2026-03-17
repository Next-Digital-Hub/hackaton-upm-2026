import type { NextRequest } from "next/server";

const SYSTEM_PROMPT = "Eres un asistente de un canal de meterologia para ayudar con las particularidades de un usuario. RESPONDE EN TEXTO CLARO (SIN MARKDOWN), PUEDES USAR EMOJIS";

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  console.log("SERVER searchParams: ", searchParams);
  
  const messageParam = searchParams.get("message");
  console.log("SERVER disasterParam: ", messageParam);
  
  if (!messageParam) {
    console.log("SERVER NO messageParam ERROR");
    return new Response('Error', { status: 400 });
  }
  
  const body = await request.json();
  if (!body) {
    return new Response('Error', { status: 400 });
  }
  
  try {
    let systemPrompt = `${SYSTEM_PROMPT}. Estos son los datos del usuario en json: ${body}`;
    
    const res = await fetch(`${process.env.API_URL}/prompt`, 
                            {
                              method: "POST",
                              headers: {
                                "Authorization": `Bearer ${process.env.API_TOKEN}`,
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify({
                                                     system_prompt: systemPrompt,
                                                     user_prompt: messageParam,
                                                   }),
                            });
    
    const data = await res.json();
    console.log("SERVER DATA: ", data);
    return new Response(JSON.stringify(data), { status: res.status });
  } catch (e) {
    // NOTE(erb): error
    console.log("SERVER ERROR: ", e);
    return new Response('Error', { status: 400 });
  }
}