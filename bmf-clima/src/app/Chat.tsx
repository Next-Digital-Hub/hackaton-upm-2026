"use client"
import { useState } from "react";

export default function Chat() {
  const [text, setText] = useState<string>("initialvalue");
  
  return (<div className="bg-gray-400 w-full h-full">
          <div>text: {text} </div>
          <input className="bg-primary border border-red-500" onChange={(e) => setText(e.target.value)} value={text} />
          </div>);
}