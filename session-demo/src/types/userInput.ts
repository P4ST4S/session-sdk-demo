import type { stepObject } from "./session";

/**
 * UserInput type
 *
 * Represents the basic user identity information
 */
export type UserInput = {
  /**
   * User's last name (family name)
   */
  lastName: string;

  /**
   * User's first name (given name)
   */
  firstName: string;

  /**
   * User's birth date in ISO format: YYYY-MM-DD
   * Example: "1990-01-31"
   */
  birthDate: string;
};

export interface UserInputFormProps {
  stepObject: stepObject;
  setUserInput: (userInput: UserInput) => void;
  initialUserInput?: UserInput;
}
