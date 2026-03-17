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
import authClient from "@/lib/auth-client";

import SignInCard from "./SignInCard";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
type LogDialogProps = {
  onLogIn: (email: string, password: string) => void;
};

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
          <SignInCard  />
          </TabsContent>
          
          <TabsContent value="signup">
          <SignInCard />
          </TabsContent>
          </Tabs>
          </DialogContent>
          );
}

type Message = {
  role: "user" | "ai" | "system",
  content: string,
};

export default function Chat() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>("");
  
  const formRef = useRef(null);
  const { data: session, isPending } = authClient.useSession();
  
  useEffect(() => {
              if (!isPending || !session?.user) {
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
      // TODO(erb): set disaster
      //setContent(JSON.stringify(json));
    } catch (e) {
      console.log("error", e);
      setError("Error while fetching");
    } finally {
      setLoading(false);
    }
  }
  
  async function requestMessage(message: string) {
    setMessages(prev => [...prev, {
                           role: "user",
                           content: message,
                         }]);
    try { 
      setLoading(true);
      const params = new URLSearchParams();
      params.append("message", message);
      
      const res = await fetch(`${process.env.HOST_URL}/api/chat?${params}`);
      const json = await res.json();
      
      const textResponse = json.response;
      if (textResponse) {
        setMessages(prev => [...prev, {
                               role: "ai",
                               content: textResponse,
                             }]);
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
  
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const message = formData.get("inputText") as string;
    
    setInputText("");
    
    await requestMessage(message);
    
    /*     
        if (!loggedIn) {
          setOpen(true);
        } else {
          
        }
     */
  }
  
  // TODO(erb): 
  // isPending      -> loading
  // !session?.user -> redirecting
  
  return (
          <Dialog open={open} onOpenChange={setOpen}>
          <LogDialog />
          <div className="bg-primary text-secondary w-full h-full grid grid-flow-rows p-3 gap-4">
          <div className="bg-neutral-900 text-secondary w-full h-full grid grid-flow-rows p-3 gap-4">
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
          {messages
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
          <Input className="rounded-lg bg-zinc-700 text-secondary" name="inputText" onChange={(e) => setInputText(e.target.value)} value={inputText}/>
          <Button type="submit" variant="secondary">Send</Button>
          </form>
          </div>
          
          </div>
          </Dialog>
          );
}
