import * as React from "react";
import { MAX_KEY_LEN, MIN_KEY_LEN } from "./const";

export enum CryptoMode {
  Encipher = "encipher",
  Decipher = "decipher",
  Inactive = "inactive"
}

export interface State {
  computingText: string;
  diffKeyMax: number;
  diffKeyMin: number;
  result: string;
  error: boolean;
  cryptoMode: CryptoMode;
}

export enum ActionKind {
  SetComputingText,
  SetCryptoMode,
  SetKeyInputDiff, 
  SetResult,
  ResetComputingText,
  SetError,
}

export interface Action {
  kind: ActionKind;
  payload?: SetCryptoModePayload | SetKeyInputDiffPayload | SetResultPayload | SetErrorPayload;
}

type SetCryptoModePayload = { cryptoMode: CryptoMode }
type SetKeyInputDiffPayload = { diffKeyMin?: number, diffKeyMax?: number }
type SetResultPayload = { result: string }
type SetErrorPayload = { error: boolean }

export const reducer: React.Reducer<State, Action> = (prevState, action): State => {

  switch (action.kind) {
    case ActionKind.SetCryptoMode: {
      const payload = action.payload as SetCryptoModePayload;
      return { ...prevState, cryptoMode: payload.cryptoMode };
    }

    case ActionKind.SetKeyInputDiff: {
      const payload = action.payload as SetKeyInputDiffPayload;
      return {
        ...prevState,
        diffKeyMin: payload.diffKeyMin || MIN_KEY_LEN,
        diffKeyMax: payload.diffKeyMax || MAX_KEY_LEN
      }
    }

    case ActionKind.SetComputingText: {
      const prevText = prevState.computingText;
      return {
        ...prevState,
        computingText: prevText.length == 0 || prevText.length > 2 ? "." : prevText + "."
     }
    }

    case ActionKind.ResetComputingText: {
      return {
        ...prevState,
        computingText: ""
     }
    }

    case ActionKind.SetResult: {
      const payload = action.payload as SetResultPayload;

      return {
        ...prevState,
        computingText: "",
        cryptoMode: CryptoMode.Inactive,
        result: payload.result
      }
    }

    case ActionKind.SetError: {
      const payload = action.payload as SetErrorPayload;

      return {
        ...prevState,
        computingText: "",
        cryptoMode: CryptoMode.Inactive,
        error: payload.error
      }
    }

    default:
      return prevState;
  }
};

