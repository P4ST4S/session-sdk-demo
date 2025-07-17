export interface ContactInfo {
  email: string;
  phoneNumber: string;
}

export interface ContactInfoFormProps {
  stepObject: {
    setStep: (step: number) => void;
    step: number;
  };
  setContactInfo: (contactInfo: ContactInfo) => void;
  initialContactInfo?: ContactInfo;
}
