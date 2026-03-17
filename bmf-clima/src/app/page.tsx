"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useRef, useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useSession } from "@/lib/auth-client";

import LoginCard from "./LoginCard";
/*import { Field } from "@base-ui/react";*/
import {Field, FieldDescription, FieldLabel } from "@/components/ui/field"


function LogDialog() {
  
  const onLogIn = (email: string, password: string) => {
  }
  
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
          <LoginCard onLogIn={onLogIn} />
          </TabsContent>
          
          <TabsContent value="signup">
          <LoginCard onLogIn={onLogIn} />
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
  const { data: session, isPending } = useSession();
  
  useEffect(() => {
              if (!isPending || !session?.user) {
                // NOTE(erb): should login here
                //setOpen(true);
              }
            }, [isPending, session]);
  
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
  
  // TODO(erb): 
  // isPending      -> loading
  // !session?.user -> redirecting
  
  return (
          <Dialog open={open} onOpenChange={setOpen}>
          <LogDialog />
          <div className="bg-neutral-900 text-secondary w-full h-full grid grid-flow-rows p-3 gap-4">
          {/*<div> 
                                                                                                                                                                                                    <div>
                                                                                                                                                                                                    {loading && <Spinner /> }
                                                                                                                                                                                                    {content && content.length > 0 && <div>Content: {content}</div>}
                                                                                                                                                                                                    </div>
                                                                                                                                                                                                    {error && error.length > 0 && <div className="text-red-500">{error}</div>}
                                                                                                                                                                                                    </div>*/}
          
          <div>
            <Field className = "w-full sticky top-0 z-index bg-neutral-500 p-4 rounded-lg ">
              <FieldLabel>Emergencias Climaticas</FieldLabel>
              <FieldDescription className = "text-color-zinc-500 justify-self-center  p-2">
                  Olas de calor
                  Tormenta Electrica
              </FieldDescription>
            </Field>

          </div>
          <div className="flex flex-col gap-4 p-4 "> 
          {chatConversation
              .map((chatMessage, i) => (
                                        <div key={`${chatMessage.role}-${chatMessage.content}-${i}`} className={`flex w-full ${chatMessage.role === "user" ? "justify-end" : "justify-start"}`}>

                                          {/* La burbuja: "w-fit" hace que el fondo solo ocupe el texto */}
                                      <div className={` max-w-[80%] w-fit p-3 rounded-lg ${chatMessage.role === "user" ? "bg-zinc-600 text-right" : "bg-zinc-700 text-left"}`}>
                                        <div className="text-xs font-bold text-blue-500 uppercase mb-1">
                                          {chatMessage.role}</div>
                                        <div className="text-white">{chatMessage.content}</div>
                                        </div>
                                        </div>
                                        ))}
          </div>
          
          <form onSubmit={handleSubmit} ref={formRef} className="flex flex-row bg-none rounded-md p-2">
          <Input className="rounded-lg bg-zinc-700 text-secondary" onChange={(e) => setText(e.target.value)} value={text} />
          <Button type="submit" variant="secondary">Send</Button>
          </form>
          </div>
          </Dialog>
          
          );
}

const chatConversation = [
                          {
                            role: "system",
                            content: "You are a helpful assistant."
                          },
                          {
                            role: "user",
                            content: "Hey, can you help me plan a trip?"
                          },
                          {
                            role: "ai",
                            content: "Of course! Where are you thinking of going?"
                          },
                          {
                            role: "user",
                            content: "I'm considering Japan, maybe Tokyo and Kyoto."
                          },
                          {
                            role: "ai",
                            content: "Great choices! Tokyo is vibrant and modern, while Kyoto offers beautiful temples and tradition."
                          },
                          {
                            role: "user",
                            content: "What’s the best time to visit?"
                          },
                          {
                            role: "ai",
                            content: "Spring (March to May) for cherry blossoms or autumn (September to November) for colorful foliage are ideal."
                          },
                          {
                            role: "user",
                            content: "Nice! Any food recommendations?"
                          },
                          {
                            role: "ai",
                            content: "Definitely try sushi, ramen, tempura, and okonomiyaki. Each region has its own specialties."
                          },
                          
                          ];
