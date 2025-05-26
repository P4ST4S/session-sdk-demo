import { useState } from "react";
import * as Label from "@radix-ui/react-label";
import type { UserInputFormProps } from "../../types/userInput";
import Button from "../ui/Button";
import PoweredBy from "../ui/PoweredBy";
import Title from "../ui/Title";
import Subtitle from "../ui/Subtitle";
import ButtonDesktop from "../ui/ButtonDesktop";
import useIsMobile from "../../hooks/useIsMobile";

const days = Array.from({ length: 31 }, (_, i) => i + 1);
const years = Array.from(
  { length: 100 },
  (_, i) => new Date().getFullYear() - i
);
const monthLabels = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

const UserInputForm = ({ stepObject, setUserInput }: UserInputFormProps) => {
  const { setStep, step } = stepObject;
  const isMobile = useIsMobile();
  const [error, setError] = useState({
    firstName: false,
    lastName: false,
    birthDate: false,
    notMajor: false,
  });
  const [form, setForm] = useState({
    lastName: "",
    firstName: "",
    birthDate: "",
    day: "",
    month: "",
    year: "",
  });

  const checkIsMajor = (birthDate: string) => {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    const age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();
    const dayDiff = today.getDate() - birthDateObj.getDate();
    return (
      age > 18 ||
      (age === 18 && (monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0)))
    );
  };

  const goOnNextStep = () => {
    if (!form.firstName) {
      setError((prev) => ({ ...prev, firstName: true }));
    }
    if (!form.lastName) {
      setError((prev) => ({ ...prev, lastName: true }));
    }
    if (!form.birthDate) {
      setError((prev) => ({ ...prev, birthDate: true }));
    }
    // Check if birth date is superior to 18 years
    if (form.birthDate && !checkIsMajor(form.birthDate)) {
      setError((prev) => ({ ...prev, notMajor: true }));
      return;
    }

    if (form.firstName && form.lastName && form.birthDate) {
      setStep(step + 1);
      setUserInput({
        lastName: form.lastName,
        firstName: form.firstName,
        birthDate: form.birthDate,
      });
    }
  };

  const goOnPreviousStep = () => {
    setStep(step - 1);
  };

  const handleChange = (key: keyof typeof form, value: string) => {
    setError((prev) => ({ ...prev, [key]: false }));
    if (key === "day" || key === "month" || key === "year") {
      setError((prev) => ({
        ...prev,
        birthDate: false,
      }));
    }

    setForm((prev) => {
      const updated = { ...prev, [key]: value };

      const { day, month, year } = updated;
      if (day && month && year) {
        const paddedMonth = month.padStart(2, "0");
        const paddedDay = day.padStart(2, "0");
        updated.birthDate = `${year}-${paddedMonth}-${paddedDay}`;
      } else {
        updated.birthDate = "";
      }

      return updated;
    });
  };

  return (
    <div className="space-y-4 pt-8 relative justify-center items-center w-full max-w-[322px] mx-auto">
      <div className="flex flex-col gap-5 mt-4">
        <Title>Informations d’identité</Title>
        <Subtitle>
          Afin de commencer le processus de vérification, veuillez entrer vos
          informations d’identité
        </Subtitle>
      </div>

      <div className="flex flex-col gap-6 mt-8 w-[322px]">
        <div className="flex flex-col gap-2">
          <Label.Root htmlFor="firstName" className="text-xl font-semibold">
            Prénom
          </Label.Root>
          <input
            id="firstName"
            type="text"
            value={form.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            className={`border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#11E5C5] ${
              error.firstName ? "border-red-500" : "border-gray-300"
            }`}
          />
          {error.firstName && (
            <p className="text-red-500 text-sm">Veuillez entrer votre prénom</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label.Root htmlFor="lastName" className="text-xl font-semibold">
            Nom
          </Label.Root>
          <input
            id="lastName"
            type="text"
            value={form.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            className={`border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#11E5C5] ${
              error.lastName ? "border-red-500" : "border-gray-300"
            }`}
          />
          {error.lastName && (
            <p className="text-red-500 text-sm">Veuillez entrer votre nom</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label.Root className="text-xl font-semibold">
            Date de naissance
          </Label.Root>
          <div className="flex gap-2">
            {/* Day Select */}
            <select
              value={form.day}
              onChange={(e) => handleChange("day", e.target.value)}
              className={`border rounded-md p-2 w-1/3 focus:outline-none focus:ring-2 focus:ring-[#11E5C5]
                ${
                  error.birthDate || error.notMajor
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
            >
              <option value="">Jour</option>
              {days.map((d) => (
                <option key={d} value={String(d)}>
                  {d}
                </option>
              ))}
            </select>

            {/* Month Select */}
            <select
              value={form.month}
              onChange={(e) => handleChange("month", e.target.value)}
              className={`border rounded-md p-2 w-1/3 focus:outline-none focus:ring-2 focus:ring-[#11E5C5]
                ${
                  error.birthDate || error.notMajor
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
            >
              <option value="">Mois</option>
              {monthLabels.map((label, i) => (
                <option key={label} value={String(i + 1).padStart(2, "0")}>
                  {label}
                </option>
              ))}
            </select>

            {/* Year Select */}
            <select
              value={form.year}
              onChange={(e) => handleChange("year", e.target.value)}
              className={`border rounded-md p-2 w-1/3 focus:outline-none focus:ring-2 focus:ring-[#11E5C5]
                ${
                  error.birthDate || error.notMajor
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
            >
              <option value="">Année</option>
              {years.map((y) => (
                <option key={y} value={String(y)}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          {error.birthDate && (
            <p className="text-red-500 text-sm">
              Veuillez entrer votre date de naissance
            </p>
          )}
          {error.notMajor && (
            <p className="text-red-500 text-sm">
              Vous devez être majeur pour continuer
            </p>
          )}
        </div>
      </div>

      {!isMobile && (
        <div className="flex flex-row justify-end-safe gap-3 mt-12 mb-[-24px]">
          <ButtonDesktop onClick={goOnPreviousStep} type="back">
            Retour
          </ButtonDesktop>
          <ButtonDesktop onClick={goOnNextStep} type="continue">
            Continuer
          </ButtonDesktop>
        </div>
      )}

      <div className="fixed bottom-5 left-0 w-full px-6 sm:static sm:px-12 pb-[env(safe-area-inset-bottom)] bg-white">
        <div className="max-w-[345px] mx-auto py-4 sm:mb-4">
          {isMobile && (
            <Button onClick={goOnNextStep} className="w-full">
              Continuer
            </Button>
          )}
        </div>
        <PoweredBy />
      </div>
    </div>
  );
};

export default UserInputForm;
