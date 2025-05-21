import type { stepObject } from "./session";

export type UserInput = {
  lastName: string;
  firstName: string;
  birthDate: string;
};

export interface UserInputFormProps {
  stepObject: stepObject;
  setUserInput: (userInput: UserInput) => void;
}
