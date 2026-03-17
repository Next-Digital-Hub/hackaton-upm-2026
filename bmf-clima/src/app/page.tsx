"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useRef } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import LoginCard from "./LoginCard";


function LogDialog() {
  
  return (
          <DialogContent className="sm:max-w-sm">
          <DialogHeader>
          <DialogTitle>Welcome to BMF-Clima</DialogTitle>
          <DialogDescription>
          Introduce los datos para tener una experiencia personalizada.
          </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="overview" className="">
          <TabsList>
          <TabsTrigger value="login">Log In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
          
          </TabsList>
          <TabsContent value="login">
          <LoginCard />
          </TabsContent>
          
          <TabsContent value="signup">
          <LoginCard />
          </TabsContent>
          
          <DialogFooter>
          <DialogClose asChild>
          <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button type="submit">Guardar </Button>
          </DialogFooter>
          </Tabs>
          </DialogContent>
          );
}

export default function Chat() {
  const [text, setText] = useState<string>("initialvalue");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  
  const formRef = useRef(null);
  
  const loggedIn = false;
  
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
  
  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    // NOTE(erb): parse info
    
    if (!loggedIn) {
      setOpen(true);
    } else {
    }
  }
  
  return (
          <Dialog open={open} onOpenChange={setOpen}>
          
          <LogDialog />
          
          <div className="bg-primary text-secondary w-full h-full">
          <div> 
          <div>
          {loading && <Spinner /> }
          {content && content.length > 0 && <div>Content: {content}</div>}
          </div>
          {error && error.length > 0 && <div className="text-red-500">{error}</div>}
          </div>
          
          
          <div> CONTENT WILL BE HERRE</div>
          <form onSubmit={handleSubmit} ref={formRef}>
          <Input className="" onChange={(e) => setText(e.target.value)} value={text} />
          </form>
          
          
          <DialogTrigger asChild>
          <Button variant="outline">Sign Up</Button>
          </DialogTrigger>
          </div>
          </Dialog>
          
          );
}
