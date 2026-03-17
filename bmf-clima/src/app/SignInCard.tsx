import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxChips,
  ComboboxChip,
  ComboboxValue,
  ComboboxChipsInput
} from "@/components/ui/combobox"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react";
import { useRouter } from "next/navigation";
import authClient from "@/lib/auth-client";
import { Spinner } from "@/components/ui/spinner";


export type UserData = {
  province: string;
  houseKind: string;
  specialNeeds: string[];
};

export default function SignInCard({ onLogIn }: { onLogIn: (data: UserData) => void }) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  
  const [needs, setNeeds] = useState<string[]>([]);
  
  const homeItems = ["Sótano", "Planta baja", "Piso alto", "Casa de Campo"];
  const [homeType, setHomeType] = useState<string>(homeItems[0]);
  
  const handleLogIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    setLoading(false);
    setError(null);
    
    try { 
      const formData = new FormData(e.currentTarget);
      const province = formData.get("province") as string;
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      
      onLogIn({
                province,
                houseKind: homeType,
                specialNeeds: needs,
              })
        
    } catch (e) {
      setError("Something wen't wrong");
    } finally {
      setLoading(false);
    }
  }
  
  const needOptions = ["Silla de ruedas", "Persona dependiente", "Mascota"];
  
  return (
          <Card>
          <form onSubmit={handleLogIn}>
          <CardHeader>
          <CardTitle>  Welcome to BMF-Clime </CardTitle>
          {loading && <Spinner />}
          
          <CardDescription>Login to your account</CardDescription>
          <CardAction>
          action here?
          </CardAction>
          </CardHeader>
          <CardContent>
          <div className="flex flex-col gap-6">
          
          <div className="grid gap-2">
          <Label htmlFor="email">Provincia</Label>
          <Input
          name="province"
          type="text"
          placeholder="Valencia"
          required
          />
          </div>
          
          
          <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
          name="email"
          type="email"
          placeholder="m@example.com"
          required
          />
          </div>
          
          <div className="grid gap-2">
          <div className="flex items-center">
          <Label htmlFor="password">Contraseña</Label>
          <a
          href="#"
          className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
          >
          ¿ Has olvidado tu contraseña?
          </a>
          </div>
          <Input name="password" type="password" required />
          </div>
          
          <div className="grid gap-2">
          <div className="flex items-center">
          <Label htmlFor="password">Tipo de vivienda</Label>
          </div>
          <Combobox items={homeItems} >
          <ComboboxInput placeholder="Select a type home" />
          <ComboboxContent>
          <ComboboxEmpty>No hay resultados.</ComboboxEmpty>
          <ComboboxList>
          {(item) => (
                      <ComboboxItem key={item} value={item}>
                      {item}
                      </ComboboxItem>
                      )}
          </ComboboxList>
          </ComboboxContent>
          </Combobox>
          </div>
          
          <div className="grid gap-2">
          <div className="flex items-center">
          <Label htmlFor="need">Necesidades</Label>
          </div>
          <Combobox 
          items={needOptions} 
          value={needs} 
          onValueChange={setNeeds}
          multiple
          >
          
          <ComboboxChips>
          <ComboboxValue>
          {needs.map((item) => (
                                <ComboboxChip key={item}>{item}</ComboboxChip>
                                ))}
          </ComboboxValue>
          <ComboboxChipsInput placeholder="Necesidad" />
          </ComboboxChips>
          <ComboboxContent>
          <ComboboxEmpty>Opcion no encontrada.</ComboboxEmpty>
          <ComboboxList>
          {(item) => (<ComboboxItem key={item} value={item}>{item}</ComboboxItem>)}
          </ComboboxList>
          </ComboboxContent>
          </Combobox>
          </div>
          </div>
          
          </CardContent>
          <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full">
          Login
          </Button>
          </CardFooter>
          </form>
          </Card>
          );
}
