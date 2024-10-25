import { Field, Label, Textarea } from "@headlessui/react";

type Props = {
  name: string;
  label: string;
};

export function FieldTabs({ name, label }: Props) {
  return (
    <Field className="flex flex-col">
      <Label className="mb-4 font-medium">{label}</Label>
      <Textarea name={name} className="field-input" />
    </Field>
  );
}
