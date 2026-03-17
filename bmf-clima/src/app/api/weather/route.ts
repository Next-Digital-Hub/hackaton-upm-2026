import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  
  const searchParams = request.nextUrl.searchParams;
  console.log("SERVER searchParams: ", searchParams);
  
  const disasterParam = searchParams.get("disaster");
  console.log("SERVER disasterParam: ", disasterParam);
  
  if (!disasterParam) {
    console.log("SERVER NO disasterParam ERROR");
    return new Response('Error', { status: 400 });
  }
  
  try {
    const res = await fetch(`${process.env.API_URL}/weather?disaster=${disasterParam}`, 
                            {
                              headers: {
                                "Authorization": `Bearer ${process.env.API_TOKEN}`,
                                "Content-Type": "application/json",
                              },
                            });
    
    const data = await res.json();
    console.log("SEERVER DATA: ", data);
    return new Response(JSON.stringify(data), { status: res.status });
  } catch (e) {
    // NOTE(erb): error
    console.log("SERVER ERROR: ", e);
    return new Response('Error', { status: 400 });
  }
}