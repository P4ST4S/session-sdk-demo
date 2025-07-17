/**
 * @file ChooseCountryJDI.tsx
 * @description This component provides a UI for users to se            <Title className="mb-5 sm:mb-2">Document issuing country</Title>
            <Subtitle>
              Select the issuing country shown on your ID document, as well as the type of document you want to use
            </Subtitle>their document's issuing country
 * and document type for identity verification.
 *
 * @component ChooseCountryJDI
 *
 * @props {function} setStep - Callback function to change the current step in the parent component
 *                             workflow. Called with 0 when the user proceeds to the next step.
 * @props {function} setCountry - Callback function to set the selected country in the parent
 *                                component. Receives the country ID or null.
 * @props {function} setDocumentType - Callback function to set the selected document type in the
 *                                    parent component. Receives the document type ID or null.
 *
 * @state {DrawerItem|null} selectedCountry - Stores the user's selected country as a DrawerItem
 *                                           object containing id and label properties.
 * @state {DrawerItem|null} selectedDocumentType - Stores the user's selected document type as a
 *                                                DrawerItem object.
 *
 * @flow
 * 1. User selects a country from the dropdown
 * 2. Based on the selected country, document type options are displayed
 * 3. User selects a document type
 * 4. User clicks "Commencer ma vérification" to proceed
 * 5. Selected country and document type are passed to parent component via callbacks
 *
 * @dependencies
 * - countries - Array of country objects imported from jdiCountry utils
 * - documentTypesFromCountryId - Function to get document types based on country ID
 * - SelectDrawer - UI component for selecting options from a drawer
 *
 * @example
 * <ChooseCountryJDI
 *   setStep={(step) => setCurrentStep(step)}
 *   setCountry={(country) => setSelectedCountry(country)}
 *   setDocumentType={(docType) => setSelectedDocType(docType)}
 * />
 */

import Button from "../ui/Button";
import Subtitle from "../ui/Subtitle";
import Title from "../ui/Title";
import { countries, documentTypesFromCountryId } from "../../utils/jdiCountry";
import type { DrawerItem } from "../../utils/jdiCountry";
import { useState } from "react";
import { SelectDrawer } from "../ui/SelectDrawer";
import { useDocumentContext } from "../../context/DocumentContext";

interface ChooseCountryJDIProps {
  setStep: (nbr: number) => void;
  setCountry: (country: string | null) => void;
  setDocumentType: (documentType: string | null) => void;
}

const ChooseCountryJDI = ({
  setStep,
  setCountry,
  setDocumentType,
}: ChooseCountryJDIProps) => {
  const [selectedCountry, setSelectedCountry] = useState<DrawerItem | null>(
    null
  );

  // Use global context instead of local state for document type
  const { selectedDocumentType, setSelectedDocumentType } =
    useDocumentContext();

  const goOnNextStep = () => {
    setStep(5);
    setCountry(selectedCountry?.id || null);

    // Make sure the document is correctly defined in both context and props
    setDocumentType(selectedDocumentType?.id || null);

    // Debug log
  };

  return (
    <div className="flex flex-col justify-between h-full w-full">
      {/* Main content area */}
      <div className="flex-1 px-4 py-6 pt-11 md:px-8 md:py-8">
        <div className="w-full max-w-md mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <Title className="text-xl md:text-2xl lg:text-3xl">
              Pays émetteur du document
            </Title>
            <Subtitle className="text-sm md:text-base text-gray-600 leading-relaxed">
              Sélectionnez le pays émetteur indiqué sur votre document
              d'identité, ainsi que le type de document que vous souhaitez
            </Subtitle>
          </div>

          {/* Form fields */}
          <div className="space-y-6">
            {/* Country Selection */}
            <div className="space-y-2">
              <SelectDrawer
                title="Pays émetteur"
                items={countries}
                selectedItem={selectedCountry}
                onChange={setSelectedCountry}
                errorMessage="Aucun pays trouvé"
              />
            </div>

            {/* Document Type Selection */}
            {selectedCountry && (
              <div className="space-y-2">
                <SelectDrawer
                  title="Type du document"
                  items={documentTypesFromCountryId(selectedCountry.id)}
                  selectedItem={selectedDocumentType}
                  onChange={(docType) => {
                    setSelectedDocumentType(docType);
                  }}
                  errorMessage="Aucun type de document trouvé"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer with button */}
      <div className="sticky bottom-0 md:static bg-white border-t md:border-t-0 p-4 md:p-0 md:pb-8">
        <div className="w-full max-w-md mx-auto">
          <Button
            onClick={goOnNextStep}
            className="w-full py-3 md:py-4"
            disabled={!selectedCountry || !selectedDocumentType}
          >
            Commencer ma vérification
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChooseCountryJDI;
