"use client"
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Chat() {
  const [text, setText] = useState<string>("empty");
  const [content, setContent] = useState<string | null>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  
  async function requestDisaster(isDisaster: boolean) {
    
    try { 
      setLoading(true);
      const params = new URLSearchParams();
      params.append("disaster", isDisaster.toString());
      
      const res = await fetch(`${process.env.HOST_URL}/api/weather?${params}`);
      const json = await res.json();
      setContent(JSON.stringify(json));
    } catch (e) {
      console.log("error", e);
      setError("Error while fetching");
    } finally {
      setLoading(false);
    }
  }
  
  async function requestMessage() {
    const message = text;
    try { 
      setLoading(true);
      const params = new URLSearchParams();
      params.append("message", message);
      
      const res = await fetch(`${process.env.HOST_URL}/api/chat?${params}`);
      const json = await res.json();
      
      const textResponse = json.response;
      if (textResponse) {
        setContent(textResponse);
      } else {
        throw new Error("failed");
      }
    } catch (e) {
      console.log("error", e);
      setError("Error while fetching");
    } finally {
      setLoading(false);
    }
  }
  
  
  return (
          <div className="bg-gray-400 w-full h-full">
          <div> 
          <div>
          {loading && <Spinner /> }
          {content && <div>Content: {content}</div>}
          </div>
          {error && <div className="text-red-500">{error}</div>}
          </div>
          <div>text: {text} </div>
          <div className="flex flex-col gap-2">
          <Input 
          className="bg-primary border border-red-500" 
          onChange={(e) => setText(e.target.value)} 
          value={text} 
          />
          <div className="flex flex-col gap-2">
          <Button className="bg-secondary text-primary" onClick={() => requestMessage()}>Send!</Button>
          <Button onClick={() => requestDisaster(true)}>Disaster!</Button>
          <Button onClick={() => requestDisaster(false)}>Weather!</Button>
          </div>
          </div>
          </div>
          );
}