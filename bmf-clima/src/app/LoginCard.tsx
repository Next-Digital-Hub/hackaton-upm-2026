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
} from "@/components/ui/combobox"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const typeHome = ["Sótano", "Planta baja", "Piso alto", "Casa de Campo"] as const;
const needs = ["Silla de ruedas", "Persona dependiente", "Mascota"] as const;

function SelectHome() {
  return (
          <Combobox items={typeHome}>
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
          )
}
function SelectNeeds() {
  return (
          <FieldSet>
          <FieldLegend>
          Selecciona tus necesidades
          </FieldLegend>
          <FieldGroup className="gap-3">
          <Field orientation="horizontal">
          <Checkbox
          id="finder-pref-9k2-hard-disks-ljj-checkbox"
          name="finder-pref-9k2-hard-disks-ljj-checkbox"
          defaultChecked
          />
          <FieldLabel
          htmlFor="finder-pref-9k2-hard-disks-ljj-checkbox"
          className="font-normal"
          >
          Sótano
          </FieldLabel>
          </Field>
          <Field orientation="horizontal">
          <Checkbox
          id="finder-pref-9k2-external-disks-1yg-checkbox"
          name="finder-pref-9k2-external-disks-1yg-checkbox"
          defaultChecked
          />
          <FieldLabel
          htmlFor="finder-pref-9k2-external-disks-1yg-checkbox"
          className="font-normal"
          >
          Planta baja
          </FieldLabel>
          </Field>
          <Field orientation="horizontal">
          <Checkbox
          id="finder-pref-9k2-cds-dvds-fzt-checkbox"
          name="finder-pref-9k2-cds-dvds-fzt-checkbox"
          />
          <FieldLabel
          htmlFor="finder-pref-9k2-cds-dvds-fzt-checkbox"
          className="font-normal"
          >
          Piso Alto
          </FieldLabel>
          </Field>
          <Field orientation="horizontal">
          <Checkbox
          id="finder-pref-9k2-connected-servers-6l2-checkbox"
          name="finder-pref-9k2-connected-servers-6l2-checkbox"
          />
          <FieldLabel
          htmlFor="finder-pref-9k2-connected-servers-6l2-checkbox"
          className="font-normal"
          >
          Casa de Campo
          </FieldLabel>
          </Field>
          </FieldGroup>
          </FieldSet>
          )
}

export default function LoginCard(){
  return (
          <Card>
          <CardHeader>
          <CardTitle>  Welcome to BMF-Clime </CardTitle>
          <CardDescription>Login to your account</CardDescription>
          <CardAction>
          action here?
          </CardAction>
          </CardHeader>
          <CardContent>
          <form>
          <div className="flex flex-col gap-6">
          <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
          id="email"
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
          <Input id="password" type="password" required />
          </div>
          </div>
          </form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full">
          Login
          </Button>
          </CardFooter>
          </Card>
          );
}
