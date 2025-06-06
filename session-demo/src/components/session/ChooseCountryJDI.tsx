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
import PoweredBy from "../ui/PoweredBy";
import Subtitle from "../ui/Subtitle";
import Title from "../ui/Title";
import { countries, documentTypesFromCountryId } from "../../utils/jdiCountry";
import type { DrawerItem } from "../../utils/jdiCountry";
import { useEffect, useState } from "react";
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

  // Log what is currently selected
  useEffect(() => {
    console.log("Selected country:", selectedCountry);
    console.log("Selected document type from context:", selectedDocumentType);
  }, [selectedCountry, selectedDocumentType]);

  const goOnNextStep = () => {
    setStep(3);
    setCountry(selectedCountry?.id || null);

    // Make sure the document is correctly defined in both context and props
    setDocumentType(selectedDocumentType?.id || null);

    // Debug log
    console.log("Going to next step with document context:", {
      id: selectedDocumentType?.id,
      label: selectedDocumentType?.label,
      hasTwoSides: selectedDocumentType?.hasTwoSides,
    });
  };

  return (
    <div className="relative flex sm:items-center justify-content w-full px-6 sm:px-12 pt-8 pb-[80px] overflow-hidden sm:flex-col">
      <div className="flex flex-col gap-5 mt-4 mx-auto w-full max-w-[322px]">
        <div className="flex flex-col sm:flex-col-reverse items-center mx-auto overflow-hidden">
          <div className="flex flex-col">
            <Title className="mb-5 sm:mb-2">Pays émetteur du document</Title>
            <Subtitle>
              Sélectionnez le pays émetteur indiqué sur votre document
              d’identité, ainsi que le type de document que vous souhaitez
            </Subtitle>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center">
          <SelectDrawer
            title="Pays émetteur"
            items={countries}
            selectedItem={selectedCountry}
            onChange={setSelectedCountry}
            errorMessage="Aucun pays trouvé"
          />
        </div>

        {selectedCountry && (
          <div className="flex flex-col sm:flex-row items-center mt-[-30px]">
            <SelectDrawer
              title="Type du document"
              items={documentTypesFromCountryId(selectedCountry.id)}
              selectedItem={selectedDocumentType}
              onChange={(docType) => {
                setSelectedDocumentType(docType);
                console.log("Selected document type with properties:", docType);
              }}
              errorMessage="Aucun type de document trouvé"
            />
          </div>
        )}
      </div>

      <div className="fixed bottom-5 left-0 w-full px-6 sm:static sm:px-12 pb-[env(safe-area-inset-bottom)] bg-white">
        <div className="max-w-[345px] mx-auto py-4 sm:mb-4">
          <Button
            onClick={goOnNextStep}
            className="w-full"
            disabled={!selectedCountry || !selectedDocumentType}
          >
            Commencer ma vérification
          </Button>
        </div>
        <PoweredBy />
      </div>
    </div>
  );
};

export default ChooseCountryJDI;
