import { useState } from "react";
import Title from "../ui/Title";
import Subtitle from "../ui/Subtitle";
import Button from "../ui/Button";
import ButtonDesktop from "../ui/ButtonDesktop";
import { Select } from "../ui/SelectComponent";

interface JDICountrySelectionProps {
  onCountrySelect: (countryId: string) => void;
  onBack: () => void;
  documentTypeId?: string;
}

const JDICountrySelection = ({
  onCountrySelect,
  onBack,
  documentTypeId,
}: JDICountrySelectionProps) => {
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Liste des pays disponibles
  const countries = [
    { value: "FR", label: "France" },
    { value: "ES", label: "Espagne" },
    { value: "PT", label: "Portugal" },
    { value: "DE", label: "Allemagne" },
    { value: "IT", label: "Italie" },
    { value: "BE", label: "Belgique" },
    { value: "NL", label: "Pays-Bas" },
    { value: "CH", label: "Suisse" },
    { value: "LU", label: "Luxembourg" },
    { value: "AT", label: "Autriche" },
  ];

  const handleContinue = () => {
    if (!selectedCountry) {
      setError("Veuillez sélectionner un pays émetteur");
      return;
    }
    setError("");
    onCountrySelect(selectedCountry);
  };

  // Déterminer le titre en fonction du type de document
  const getTitle = () => {
    switch (documentTypeId) {
      case "jdd":
        return "Pays émetteur du justificatif";
      case "income-proof":
        return "Pays émetteur du document";
      default:
        return "Pays émetteur du document d'identité";
    }
  };

  const getSubtitle = () => {
    switch (documentTypeId) {
      case "jdd":
        return "Sélectionnez le pays où a été émis votre justificatif de domicile.";
      case "income-proof":
        return "Sélectionnez le pays où a été émis votre justificatif de revenus.";
      default:
        return "Sélectionnez le pays où a été émis votre document d'identité.";
    }
  };

  return (
    <div className="flex flex-col justify-between h-full w-full">
      {/* Main content area */}
      <div className="flex-1 px-4 py-6 pt-11 md:px-8 md:py-8">
        <div className="w-full max-w-md mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <Title className="text-xl md:text-2xl lg:text-3xl">
              {getTitle()}
            </Title>
            <Subtitle className="text-sm text-gray-600 leading-relaxed">
              {getSubtitle()}
            </Subtitle>
          </div>

          {/* Country selection */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Pays émetteur
              </label>
              <Select
                value={selectedCountry}
                onValueChange={(value: string) => {
                  setSelectedCountry(value);
                  setError("");
                }}
                placeholder="Sélectionnez un pays"
                options={countries}
              />
              {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
            </div>

            {/* Information card */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">
                Information importante
              </h3>
              <p className="text-sm text-blue-800">
                Assurez-vous de sélectionner le bon pays émetteur pour que nous
                puissions valider correctement votre document selon les
                standards locaux.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with buttons */}
      <div className="sticky bottom-0 md:static bg-white border-t md:border-t-0 p-4 md:p-0 md:pb-8">
        <div className="w-full max-w-md mx-auto">
          {/* Mobile layout - stacked buttons */}
          <div className="flex flex-col space-y-3 md:hidden">
            <Button
              onClick={handleContinue}
              className="w-full py-3"
              disabled={!selectedCountry}
            >
              Continuer
            </Button>
            <button
              onClick={onBack}
              className="w-full text-[#3C3C40] text-center font-poppins text-sm font-medium hover:underline py-2"
            >
              Retour
            </button>
          </div>

          {/* Desktop layout - horizontal buttons */}
          <div className="hidden md:flex gap-3 justify-end">
            <ButtonDesktop onClick={onBack} type="back">
              Retour
            </ButtonDesktop>
            <ButtonDesktop
              onClick={handleContinue}
              type="continue"
              disabled={!selectedCountry}
            >
              Continuer
            </ButtonDesktop>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JDICountrySelection;
