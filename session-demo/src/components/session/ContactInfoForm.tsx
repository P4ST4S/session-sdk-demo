import { useState, useEffect, useRef } from "react";
import * as Label from "@radix-ui/react-label";
import type { ContactInfoFormProps } from "../../types/contactInfo";
import Button from "../ui/Button";
import Title from "../ui/Title";
import Subtitle from "../ui/Subtitle";
import ButtonDesktop from "../ui/ButtonDesktop";
import useIsMobile from "../../hooks/useIsMobile";

const ContactInfoForm = ({
  stepObject,
  setContactInfo,
  initialContactInfo,
}: ContactInfoFormProps) => {
  const { setStep, step } = stepObject;
  const isMobile = useIsMobile();
  const [error, setError] = useState({
    email: false,
    phoneNumber: false,
  });

  // Use a ref to track whether this is the first render
  const isFirstRender = useRef(true);

  const [form, setForm] = useState({
    email: initialContactInfo?.email || "",
    phoneNumber: initialContactInfo?.phoneNumber || "",
  });

  // Update form when initialContactInfo changes - only on mount and when initialContactInfo changes
  useEffect(() => {
    if (initialContactInfo) {
      // Only initialize the form if we're on first render or have no form data yet
      if (isFirstRender.current || (!form.email && !form.phoneNumber)) {
        if (initialContactInfo.email || initialContactInfo.phoneNumber) {
          setForm({
            email: initialContactInfo.email || "",
            phoneNumber: initialContactInfo.phoneNumber || "",
          });
        }

        // Mark the first render as complete
        isFirstRender.current = false;
      }
    }
  }, [initialContactInfo]); // Only depend on initialContactInfo, not form state

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phone: string) => {
    // French phone number validation (10 digits, starts with 0)
    const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  };

  const goOnNextStep = () => {
    // Reset errors
    setError({
      email: false,
      phoneNumber: false,
    });

    let hasError = false;

    if (!form.email || !validateEmail(form.email)) {
      setError((prev) => ({ ...prev, email: true }));
      hasError = true;
    }
    if (!form.phoneNumber || !validatePhoneNumber(form.phoneNumber)) {
      setError((prev) => ({ ...prev, phoneNumber: true }));
      hasError = true;
    }

    if (!hasError) {
      setStep(step + 1);
      setContactInfo({
        email: form.email,
        phoneNumber: form.phoneNumber,
      });
    } else {
      console.log("ContactInfoForm: Errors found, not proceeding", {
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
    setError((prev) => ({ ...prev, [key]: false }));

    // Update form state
    setForm((prev) => {
      const updated = { ...prev, [key]: value };
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
              Informations de contact
            </Title>
            <Subtitle className="text-sm md:text-base text-gray-600 leading-relaxed">
              Veuillez renseigner vos informations de contact pour recevoir un
              code de vérification
            </Subtitle>
          </div>

          {/* Form fields */}
          <div className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <Label.Root
                htmlFor="email"
                className="block text-sm md:text-base font-semibold text-gray-900"
              >
                Adresse email
              </Label.Root>
              <input
                id="email"
                type="email"
                value={form.email || ""}
                onChange={(e) => handleChange("email", e.target.value)}
                className={`w-full px-3 py-3 md:py-4 border rounded-lg text-base transition-colors
                  focus:outline-none focus:ring-2 focus:ring-[#11E5C5] focus:border-transparent
                  ${
                    error.email
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 hover:border-gray-400"
                  }
                `}
                placeholder="exemple@email.com"
              />
              {error.email && (
                <p className="text-red-600 text-sm flex items-center gap-1">
                  <span className="text-red-500">⚠</span>
                  Veuillez entrer une adresse email valide
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label.Root
                htmlFor="phoneNumber"
                className="block text-sm md:text-base font-semibold text-gray-900"
              >
                Numéro de téléphone
              </Label.Root>
              <input
                id="phoneNumber"
                type="tel"
                value={form.phoneNumber || ""}
                onChange={(e) => handleChange("phoneNumber", e.target.value)}
                className={`w-full px-3 py-3 md:py-4 border rounded-lg text-base transition-colors
                  focus:outline-none focus:ring-2 focus:ring-[#11E5C5] focus:border-transparent
                  ${
                    error.phoneNumber
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 hover:border-gray-400"
                  }
                `}
                placeholder="06 12 34 56 78"
              />
              {error.phoneNumber && (
                <p className="text-red-600 text-sm flex items-center gap-1">
                  <span className="text-red-500">⚠</span>
                  Veuillez entrer un numéro de téléphone valide
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

export default ContactInfoForm;
