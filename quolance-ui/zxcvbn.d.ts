declare module "zxcvbn" {
    export interface ZxcvbnResult {
      score: number; 
    }
     export default function zxcvbn(password: string, userInputs?: string[]): ZxcvbnResult;
  }