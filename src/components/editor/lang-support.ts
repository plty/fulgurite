import { Language, StreamLanguage } from "@codemirror/language";
import type { Extension } from "@codemirror/state";
export type Lang = keyof typeof highlighter & keyof typeof parser;

type EagerReturnType<T> = T extends (...args: any) => Promise<infer R>
  ? R
  : never;

export const highlighter = {
  asm: async () =>
    StreamLanguage.define(
      (await import("@codemirror/legacy-modes/mode/gas")).gas,
    ) as Extension,
  cpp: async () => (await import("@codemirror/lang-cpp")).cpp() as Extension,
  jsx: async () =>
    (await import("@codemirror/lang-javascript")).javascript({
      jsx: true,
      typescript: false,
    }) as Extension,
  rust: async () => (await import("@codemirror/lang-rust")).rust() as Extension,
  tsx: async () =>
    (await import("@codemirror/lang-javascript")).javascript({
      jsx: true,
      typescript: true,
    }) as Extension,
};

export const parser = {
  asm: async () =>
    StreamLanguage.define(
      (await import("@codemirror/legacy-modes/mode/gas")).gas,
    ) as Language,
  cpp: async () =>
    (await import("@codemirror/lang-cpp")).cppLanguage as Language,
  jsx: async () =>
    (await import("@codemirror/lang-javascript")).jsxLanguage as Language,
  rust: async () =>
    (await import("@codemirror/lang-rust")).rustLanguage as Language,
  tsx: async () =>
    (await import("@codemirror/lang-javascript")).tsxLanguage as Language,
};
// eager parser is record of Lang to language
export type EagerParser = {
  [T in Lang]: Language;
};
