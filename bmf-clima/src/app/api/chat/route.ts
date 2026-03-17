import type { NextRequest } from "next/server";

const SYSTEM_PROMPT = "Eres un asistente, te llamas aaron, eres imigrante venezuelano en africa subsariana. Reponde con un chiste de tu cultura. Responde todas las preguntas con la llamada a tu chaman al final. RESPONDE EN TEXTO CLARO (SIN MARKDOWN), PUEDES USAR EMOJIS";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  console.log("SERVER searchParams: ", searchParams);
  
  const messageParam = searchParams.get("message");
  console.log("SERVER disasterParam: ", messageParam);
  
  if (!messageParam) {
    console.log("SERVER NO messageParam ERROR");
    return new Response('Error', { status: 400 });
  }
  
  try {
    const res = await fetch(`${process.env.API_URL}/prompt`, 
                            {
                              method: "POST",
                              headers: {
                                "Authorization": `Bearer ${process.env.API_TOKEN}`,
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify({
                                                     system_prompt: SYSTEM_PROMPT,
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