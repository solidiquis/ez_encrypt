import * as React from "react";
import { CryptoMode, ActionKind, reducer } from "./state";
import classNames from "classnames";
import { MAX_KEY_LEN, MIN_KEY_LEN } from "./const";
import Clipboard from "@components/clipboard";
import { encipher, decipher } from "ez-encrypt";

export default () => {
  const [state, dispatch] = React.useReducer(reducer, {
    computingText: "",
    diffKeyMax: MAX_KEY_LEN,
    diffKeyMin: MIN_KEY_LEN,
    result: "",
    error: false,
    cryptoMode: CryptoMode.Inactive
  });

  const textInput = React.useRef<HTMLTextAreaElement | null>(null);
  const keyInput = React.useRef<HTMLInputElement | null>(null);

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();

    const nativeEvent = e.nativeEvent as SubmitEvent;
    const mode = (nativeEvent.submitter as HTMLButtonElement).value as CryptoMode;

    if (state.cryptoMode != CryptoMode.Inactive)
      return;
    else
      dispatch({ kind: ActionKind.SetCryptoMode, payload: { cryptoMode: mode } });

    const text = textInput.current.value.trimEnd();

    if (text.length == 0) {
      textInput.current.focus();
      return;
    }

    const key = keyInput.current.value;

    if (key.length < MIN_KEY_LEN) {
      keyInput.current.focus();
      return;
    }

    dispatch({ kind: ActionKind.SetComputingText });

    const intervalID = setInterval(() => (
      dispatch({ kind: ActionKind.SetComputingText })
    ), 500);

    setTimeout(() => {
      try {
        const result = (() => {
          switch (mode) {
            case CryptoMode.Encipher:
              return encipher(text, key);

            case CryptoMode.Decipher:
              return decipher(text, key);
          }
        })();
        dispatch({ kind: ActionKind.SetResult, payload: { result: result } });
      } catch (_e) {
        dispatch({ kind: ActionKind.SetError, payload: { error: true } });
      } finally {
        clearInterval(intervalID);
      }
    }, 1500)
  };

  const cryptKeyChangeHandler = () => {
    const key = keyInput.current.value;

    let diffKeyMin = MIN_KEY_LEN - key.length;
    diffKeyMin = diffKeyMin <= 0 ? 0 : diffKeyMin;

    let diffKeyMax = MAX_KEY_LEN - key.length;
    diffKeyMax = diffKeyMax < 0 ? 0 : diffKeyMax;

    dispatch({
      kind: ActionKind.SetKeyInputDiff,
      payload: { diffKeyMin: diffKeyMin, diffKeyMax: diffKeyMax }
    })
  };

  const errorMessageHandler = () => {
    if (state.error)
      dispatch({ kind: ActionKind.SetError, payload: { error: false } });
  };

  return (
    <section
      className="flex flex-col h-screen justify-center"
      onClick={state.error ? errorMessageHandler : undefined}
    >
      <header className="text-center">
        <h1 className="text-3xl text-[color:var(--orange)]">EZ Encrypt</h1>
      </header>
      <aside
        className={classNames(
          "absolute w-max bg-[color:var(--bgh)] p-2 text-xs text-white border-2 border-solid border-[color:var(--red)] rounded-md",
          "py-3 mx-auto left-0 right-0",
          state.error ? undefined : "hidden"
        )}
      >
        <p>Error: Invalid text and/or key provided.</p>
      </aside>
      <article className="flex justify-center py-4">
        <form onSubmit={submitHandler} className="flex flex-row md:flex-col md:space-y-5 space-x-4 md:space-x-0">
          <div className="flex flex-col max-w-screen-md space-y-5">
            <textarea
              ref={textInput}
              className={classNames(
                "rounded-md outline-none resize-none bg-[color:var(--bgh)] p-2 caret-white text-[color:var(--aqua)]",
                "w-96 h-32 placeholder-[color:var(--aqua)]",
                "border border-solid border-white",
                "focus:border-[color:var(--green)]",
                "md:w-full"
              )}
              name="plain-text"
              placeholder="Message or cipher-text"
            />
            <input
              ref={keyInput}
              onChange={cryptKeyChangeHandler}
              className={classNames(
                "rounded-md outline-none resize-none bg-[color:var(--bgh)] p-2 caret-white text-[color:var(--aqua)]",
                "border border-solid border-white placeholder-[color:var(--aqua)]",
                "focus:border-[color:var(--green)]"
              )}
              name="key"
              placeholder="Secret key"
              maxLength={56}
              autoComplete="off"
            />
            <div className="flex flex-row justify-evenly">
              <p className="pl-2 text-[color:var(--orange)]">Remaining: { state.diffKeyMax }</p>
              <p className="pl-2 text-[color:var(--orange)]">Min: { MIN_KEY_LEN }</p>
            </div>
            <div className="flex flex-row justify-evenly">
              <button
                className={classNames(
                  "w-max bg-[color:var(--bgh)] py-2 px-10 border border-solid border-[color:var(--aqua)]",
                  "rounded-md text-[color:var(--aqua)] relative",
                  "hover:border-[color:var(--green)] active:border-[color:var(--green)]"
                )}
                type="submit"
                value={CryptoMode.Encipher}
              >
                <span className={state.cryptoMode == CryptoMode.Encipher ? "invisible" : undefined}>Encrypt</span>
                <span
                  className={classNames("absolute left-[60px]", state.cryptoMode != CryptoMode.Encipher ? "hidden" : undefined)}
                >{ state.computingText }</span>
              </button>
              <button
                className={classNames(
                  "w-max bg-[color:var(--bgh)] py-2 px-10 border border-solid border-[color:var(--blue-dim)]",
                  "rounded-md text-[color:var(--aqua)] relative",
                  "hover:border-[color:var(--green)] active:border-[color:var(--green)]"
                )}
                type="submit"
                value={CryptoMode.Decipher}
              >
                <span className={state.cryptoMode == CryptoMode.Decipher ? "invisible" : undefined}>Decrypt</span>
                <span
                  className={classNames("absolute left-[60px]", state.cryptoMode != CryptoMode.Decipher ? "hidden" : undefined)}
                >{ state.computingText }</span>
              </button>
            </div>
          </div>
          <div className="flex flex-col space-y-5 max-w-screen-md items-center">
            <textarea
              className={classNames(
                "rounded-md outline-none resize-none bg-[color:var(--bgh)] p-2 caret-white text-[color:var(--aqua)]",
                "w-96 h-full placeholder-[color:var(--aqua)]",
                "border border-solid border-white",
                "focus:border-[color:var(--green)]"
              )}
              value={state.result}
              name="cipher-text"
              disabled={true}
            />
            <Clipboard
              className={classNames(
                "pt-[0.3rem] pb-[0.7rem] px-8 text-[color:var(--aqua)] rounded-md border border-solid border-[color:var(--orange)]",
                "bg-[color:var(--bgh)] group relative",
                "hover:border-[color:var(--green)] active:border-[color:var(--green)]"
              )}
              type="button"
              content={state.result}
            >
              <div
                className={classNames(
                  "absolute w-max bg-[color:var(--bgh)] p-2 text-xs text-white border border-solid border-[color:var(--green)] rounded-md",
                  "bottom-[52px] right-[-27px] invisible group-hover:visible group-active:text-[color:var(--orange)]"
                )}
              >
                <p>Copy to clipboard</p>
              </div>
              <svg
                className="h-[25px] w-[19px]"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                version="1.1"
                viewBox="0 -189 1008 1008"
              >
                <g transform="matrix(1 0 0 -1 0 819)">
                  <path
                    fill="currentColor"
                    d="M189 630v-693h630v693h-126v-63c0 -33 -30 -63 -63 -63h-252c-33 0 -63 30 -63 63v63h-126zM567 693h-126v-63h126v63zM378 819h252c32 0 63 -41 63 -63h189c33 0 63 -30 63 -63v-819c0 -33 -30 -63 -63 -63h-756c-33 0 -63 30 -63 63v819c0 33 30 63 63 63h189 c0 22 32 63 63 63z" />
                </g>
              </svg>
            </Clipboard>
          </div>
        </form>
      </article>
    </section>
  )
}
