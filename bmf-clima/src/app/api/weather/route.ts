import type { NextRequest } from "next/server";

const SYSTEM_PROMPT = "Eres un asistente de un canal de meterologia para ayudar con las particularidades de un usuario. RESPONDE EN TEXTO CLARO (SIN MARKDOWN), PUEDES USAR EMOJIS";

export async function POST(request: NextRequest) {
  
  const searchParams = request.nextUrl.searchParams;
  console.log("SERVER searchParams: ", searchParams);
  
  const disasterParam = searchParams.get("disaster");
  console.log("SERVER disasterParam: ", disasterParam);
  
  if (!disasterParam) {
    console.log("SERVER NO disasterParam ERROR");
    return new Response('Error', { status: 400 });
  }
  
  const body = await request.json();
  if (!body) {
    return new Response('Error', { status: 400 });
  }
  const userData = body;
  
  try {
    const emergencyRes = await fetch(`${process.env.API_URL}/weather?disaster=${disasterParam}`, 
                                     {
                                       headers: {
                                         "Authorization": `Bearer ${process.env.API_TOKEN}`,
                                         "Content-Type": "application/json",
                                       },
                                     });
    
    const emergencyData = await emergencyRes.json();
    
    console.log(emergencyData);
    
    const systemPrompt = `${SYSTEM_PROMPT}. Estos son los datos del usuario en json: ${body.userData}. Da respuestas cortas SIN MARKDOWN y con EMOJIS`;
    const userPrompt = `Ayuda con estos datos de una emergencia de acuerdo con mis necesidades. ${JSON.stringify(emergencyData)}`;
    const res = await fetch(`${process.env.API_URL}/prompt`, 
                            {
                              method: "POST",
                              headers: {
                                "Authorization": `Bearer ${process.env.API_TOKEN}`,
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify({
                                                     system_prompt: systemPrompt,
                                                     user_prompt: userPrompt,
                                                   }),
                            });
    
    const data = await res.json();
    
    
    return new Response(JSON.stringify(data), { status: res.status });
  } catch (e) {
    // NOTE(erb): error
    console.log("SERVER ERROR: ", e);
    return new Response('Error', { status: 400 });
  }
}