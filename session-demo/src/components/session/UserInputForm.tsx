import { useState, useEffect, useRef } from "react";
import * as Label from "@radix-ui/react-label";
import type { UserInputFormProps } from "../../types/userInput";
import Button from "../ui/Button";
import Title from "../ui/Title";
import Subtitle from "../ui/Subtitle";
import ButtonDesktop from "../ui/ButtonDesktop";
import useIsMobile from "../../hooks/useIsMobile";
import { Select } from "../ui/SelectComponent";

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

// Convert to SelectOption format
const dayOptions = days.map((d) => ({ value: String(d), label: String(d) }));
const monthOptions = monthLabels.map((label, i) => ({
  value: String(i + 1).padStart(2, "0"),
  label,
}));
const yearOptions = years.map((y) => ({ value: String(y), label: String(y) }));

const UserInputForm = ({
  stepObject,
  setUserInput,
  initialUserInput,
}: UserInputFormProps) => {
  const { setStep, step } = stepObject;
  const isMobile = useIsMobile();
  const [error, setError] = useState({
    firstName: false,
    lastName: false,
    birthDate: false,
    notMajor: false,
  });

  // Parse the birthdate for form initialization
  const parseBirthDate = (dateString: string) => {
    if (!dateString) return { day: "", month: "", year: "" };

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return { day: "", month: "", year: "" };

      return {
        day: String(date.getDate()),
        month: String(date.getMonth() + 1).padStart(2, "0"),
        year: String(date.getFullYear()),
      };
    } catch (e) {
      console.error("Error parsing birth date:", e);
      return { day: "", month: "", year: "" };
    }
  };

  const birthDateParts = parseBirthDate(initialUserInput?.birthDate || "");

  // Use a ref to track whether this is the first render
  const isFirstRender = useRef(true);

  const [form, setForm] = useState({
    lastName: initialUserInput?.lastName || "",
    firstName: initialUserInput?.firstName || "",
    birthDate: initialUserInput?.birthDate || "",
    day: birthDateParts.day,
    month: birthDateParts.month,
    year: birthDateParts.year,
  });

  // Update form when initialUserInput changes - only on mount and when initialUserInput changes
  useEffect(() => {
    if (initialUserInput) {
      const newBirthDateParts = parseBirthDate(
        initialUserInput.birthDate || ""
      );

      // Only initialize the form if we're on first render or have no form data yet
      if (isFirstRender.current || (!form.firstName && !form.lastName)) {
        if (
          initialUserInput.firstName ||
          initialUserInput.lastName ||
          initialUserInput.birthDate
        ) {
          setForm({
            lastName: initialUserInput.lastName || "",
            firstName: initialUserInput.firstName || "",
            birthDate: initialUserInput.birthDate || "",
            day: newBirthDateParts.day,
            month: newBirthDateParts.month,
            year: newBirthDateParts.year,
          });
        }

        // Mark the first render as complete
        isFirstRender.current = false;
      }
    }
  }, [initialUserInput]); // Only depend on initialUserInput, not form state

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
    // Reset errors
    setError({
      firstName: false,
      lastName: false,
      birthDate: false,
      notMajor: false,
    });

    let hasError = false;

    if (!form.firstName) {
      setError((prev) => ({ ...prev, firstName: true }));
      hasError = true;
    }
    if (!form.lastName) {
      setError((prev) => ({ ...prev, lastName: true }));
      hasError = true;
    }
    if (!form.birthDate) {
      setError((prev) => ({ ...prev, birthDate: true }));
      hasError = true;
    }

    // Check if birth date is superior to 18 years
    if (form.birthDate && !checkIsMajor(form.birthDate)) {
      setError((prev) => ({ ...prev, notMajor: true }));
      hasError = true;
    }

    if (!hasError && form.firstName && form.lastName && form.birthDate) {
      setStep(step + 1);
      setUserInput({
        lastName: form.lastName,
        firstName: form.firstName,
        birthDate: form.birthDate,
      });
    } else {
      console.log("UserInputForm: Errors found, not proceeding", {
        hasError,
        errors: error,
      });
    }
  };

  const goOnPreviousStep = () => {
    setStep(step - 1);
  };

  const handleChange = (key: keyof typeof form, value: string) => {
    // Clear related errors
    setError((prev) => ({ ...prev, [key]: false, notMajor: false }));
    if (key === "day" || key === "month" || key === "year") {
      setError((prev) => ({
        ...prev,
        birthDate: false,
        notMajor: false,
      }));
    }

    // Update form state
    setForm((prev) => {
      const updated = { ...prev, [key]: value };

      // Recalculate birth date for day/month/year changes
      if (key === "day" || key === "month" || key === "year") {
        const { day, month, year } = updated;
        if (day && month && year) {
          const paddedMonth = month.padStart(2, "0");
          const paddedDay = day.padStart(2, "0");
          updated.birthDate = `${year}-${paddedMonth}-${paddedDay}`;
        } else {
          updated.birthDate = "";
        }
      }

      return updated;
    });
  };

  return (
    <div className="flex flex-col justify-between h-full w-full">
      {/* Main content area */}
      <div className="flex-1 px-4 py-6 pt-11 md:px-8 md:py-8">
        <div className="w-full max-w-md mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <Title className="text-xl md:text-2xl lg:text-3xl">
              Informations d'identité
            </Title>
            <Subtitle className="text-sm md:text-base text-gray-600 leading-relaxed">
              Afin de commencer le processus de vérification, veuillez entrer
              vos informations d'identité
            </Subtitle>
          </div>

          {/* Form fields */}
          <div className="space-y-6">
            {/* First Name */}
            <div className="space-y-2">
              <Label.Root
                htmlFor="firstName"
                className="block text-sm md:text-base font-semibold text-gray-900"
              >
                Prénom
              </Label.Root>
              <input
                id="firstName"
                type="text"
                value={form.firstName || ""}
                onChange={(e) => handleChange("firstName", e.target.value)}
                className={`w-full px-3 py-3 md:py-4 border rounded-lg text-base transition-colors
                  focus:outline-none focus:ring-2 focus:ring-[#11E5C5] focus:border-transparent
                  ${
                    error.firstName
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 hover:border-gray-400"
                  }
                `}
                placeholder="Entrez votre prénom"
              />
              {error.firstName && (
                <p className="text-red-600 text-sm flex items-center gap-1">
                  <span className="text-red-500">⚠</span>
                  Veuillez entrer votre prénom
                </p>
              )}
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label.Root
                htmlFor="lastName"
                className="block text-sm md:text-base font-semibold text-gray-900"
              >
                Nom
              </Label.Root>
              <input
                id="lastName"
                type="text"
                value={form.lastName || ""}
                onChange={(e) => handleChange("lastName", e.target.value)}
                className={`w-full px-3 py-3 md:py-4 border rounded-lg text-base transition-colors
                  focus:outline-none focus:ring-2 focus:ring-[#11E5C5] focus:border-transparent
                  ${
                    error.lastName
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 hover:border-gray-400"
                  }
                `}
                placeholder="Entrez votre nom"
              />
              {error.lastName && (
                <p className="text-red-600 text-sm flex items-center gap-1">
                  <span className="text-red-500">⚠</span>
                  Veuillez entrer votre nom
                </p>
              )}
            </div>

            {/* Birth Date */}
            <div className="space-y-2">
              <Label.Root className="block text-sm md:text-base font-semibold text-gray-900">
                Date de naissance
              </Label.Root>
              <div className="grid grid-cols-3 gap-2 md:gap-3">
                {/* Day Select */}
                <div>
                  <Select
                    options={dayOptions}
                    value={form.day || ""}
                    onValueChange={(value) => handleChange("day", value)}
                    placeholder="Jour"
                    error={error.birthDate || error.notMajor}
                  />
                </div>

                {/* Month Select */}
                <div>
                  <Select
                    options={monthOptions}
                    value={form.month || ""}
                    onValueChange={(value) => handleChange("month", value)}
                    placeholder="Mois"
                    error={error.birthDate || error.notMajor}
                  />
                </div>

                {/* Year Select */}
                <div>
                  <Select
                    options={yearOptions}
                    value={form.year || ""}
                    onValueChange={(value) => handleChange("year", value)}
                    placeholder="Année"
                    error={error.birthDate || error.notMajor}
                  />
                </div>
              </div>

              {/* Error messages */}
              {error.birthDate && (
                <p className="text-red-600 text-sm flex items-center gap-1">
                  <span className="text-red-500">⚠</span>
                  Veuillez entrer votre date de naissance
                </p>
              )}
              {error.notMajor && (
                <p className="text-red-600 text-sm flex items-center gap-1">
                  <span className="text-red-500">⚠</span>
                  Vous devez être majeur pour continuer
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer with buttons */}
      <div className="sticky bottom-0 md:static bg-white border-t md:border-t-0 p-4 md:p-0 md:pb-8">
        <div className="w-full max-w-md mx-auto">
          {isMobile ? (
            /* Mobile: Single continue button */
            <Button onClick={goOnNextStep} className="w-full py-3">
              Continuer
            </Button>
          ) : (
            /* Desktop: Back and continue buttons */
            <div className="flex gap-3 justify-end">
              <ButtonDesktop onClick={goOnPreviousStep} type="back">
                Retour
              </ButtonDesktop>
              <ButtonDesktop onClick={goOnNextStep} type="continue">
                Continuer
              </ButtonDesktop>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserInputForm;
