/**
 * @file UserInputForm.tsx
 * @description This component provides a form for users to input their identity information
 * including first name, last name, and date of birth for identity verification.
 *
 * @component UserInputForm
 *
 * @props {object} stepObject - Object containing step management functions from the parent component
 * @props {function} stepObject.setStep - Function to change the current step in the parent workflow
 * @props {number} stepObject.step - Current step number in the parent workflow
 * @props {function} setUserInput - Callback function to set the user input data in the parent component
 *
 * @state {object} form - Object containing form input values
 * @state {string} form.firstName - User's first name
 * @state {string} form.lastName - User's last name
 * @state {string} form.birthDate - Formatted birth date (YYYY-MM-DD)
 * @state {string} form.day - Selected day of birth
 * @state {string} form.month - Selected month of birth
 * @state {string} form.year - Selected year of birth
 *
 * @state {object} error - Object tracking validation errors
 * @state {boolean} error.firstName - Whether first name has an error
 * @state {boolean} error.lastName - Whether last name has an error
 * @state {boolean} error.birthDate - Whether birth date has an error
 * @state {boolean} error.notMajor - Whether user is not of legal age (18+)
 *
 * @validation
 * - All fields are required (first name, last name, birth date)
 * - User must be at least 18 years old (calculated from birth date)
 *
 * @flow
 * 1. User enters their first name, last name, and selects their date of birth
 * 2. Form validates that all fields are filled and user is of legal age
 * 3. On successful validation, data is passed to parent component and user proceeds
 * 4. User can go back to previous step if needed
 *
 * @responsiveness
 * - Displays different button layouts for mobile and desktop devices
 * - Mobile: Single "Continue" button at the bottom of the screen
 * - Desktop: "Back" and "Continue" buttons side by side
 *
 * @dependencies
 * - useIsMobile - Custom hook to detect if the user is on a mobile device
 * - Radix UI Label - For accessible form labels
 * - Button components - For navigation actions
 *
 * @example
 * <UserInputForm
 *   stepObject={{ step: 1, setStep: (step) => setCurrentStep(step) }}
 *   setUserInput={(data) => handleUserData(data)}
 * />
 */

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
