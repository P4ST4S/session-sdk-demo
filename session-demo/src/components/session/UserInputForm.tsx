import { useState } from "react";
import * as Label from "@radix-ui/react-label";
import type { UserInput, UserInputFormProps } from "../../types/userInput";

const UserInputForm = ({ stepObject }: UserInputFormProps) => {
  const { setStep, step } = stepObject;
  const [form, setForm] = useState<UserInput>({
    lastName: "",
    firstName: "",
    birthDate: "",
  });

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <form className="space-y-4">
      <div className="flex flex-col gap-1">
        <Label.Root htmlFor="firstName" className="text-sm font-medium">
          Prénom
        </Label.Root>
        <input
          id="firstName"
          type="text"
          value={form.firstName}
          onChange={(e) => handleChange("firstName", e.target.value)}
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label.Root htmlFor="lastName" className="text-sm font-medium">
          Nom
        </Label.Root>
        <input
          id="lastName"
          type="text"
          value={form.lastName}
          onChange={(e) => handleChange("lastName", e.target.value)}
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label.Root htmlFor="birthDate" className="text-sm font-medium">
          Date de naissance
        </Label.Root>
        <input
          id="birthDate"
          type="date"
          value={form.birthDate}
          onChange={(e) => handleChange("birthDate", e.target.value)}
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="button"
        onClick={() => {
          console.log("Form submitted:", form);
          setStep(step + 1);
        }}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Submit
      </button>
    </form>
  );
};

export default UserInputForm;
