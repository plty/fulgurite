import { Sabre } from "$components/Sabre";
import type { Lang } from "$components/editor/lang-support";
import { cppLanguage } from "@codemirror/lang-cpp";
import { jsxLanguage, tsxLanguage } from "@codemirror/lang-javascript";
import { rustLanguage } from "@codemirror/lang-rust";
import { StreamLanguage } from "@codemirror/language";
import { gas } from "@codemirror/legacy-modes/mode/gas";

export const parser = {
  asm: StreamLanguage.define(gas),
  cpp: cppLanguage,
  jsx: jsxLanguage,
  rust: rustLanguage,
  tsx: tsxLanguage,
};

type FoilProp = {
  code: string;
  lang: Lang;
  lineGroup: { [line: number]: number };
};
export const Foil = ({ code, lang, lineGroup }: FoilProp) => {
  return (
    <Sabre code={code} lang={lang} parserHint={parser} lineGroup={lineGroup} />
  );
};
