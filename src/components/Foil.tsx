import { Sabre } from "$components/Sabre";
import type { Lang } from "$components/editor/lang-support";
import { cppLanguage } from "@codemirror/lang-cpp";
import { jsxLanguage, tsxLanguage } from "@codemirror/lang-javascript";
import { rustLanguage } from "@codemirror/lang-rust";
import { StreamLanguage } from "@codemirror/language";
import { gas } from "@codemirror/legacy-modes/mode/gas";
import { type EditorConfig } from "./Fencey";
import _reduce from "lodash/reduce";

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
  editorConfig: Partial<EditorConfig>;
  lineGroup: { [line: number]: number };
};
export const Foil = ({ code, editorConfig, lang, lineGroup }: FoilProp) => {
  return (
    <Sabre
      code={code}
      lang={lang}
      parserHint={parser}
      editorConfig={editorConfig}
      lineGroup={lineGroup}
    />
  );
};

export const FramedFoil = () => {
  return (
    <div>
      <div className="border-night-500 flex border-x border-t">
        <div className="border-frost-3 bg-night-700 border-t-2 px-6 py-1 font-mono">
          hehe.cpp
        </div>
        <div className="border-night-500 bg-night-600 w-full border-b border-l" />
      </div>
      <div className="border-night-500 border-x border-b text-sm">
        <Foil code={content} lang={language} lineGroup={{}} editorConfig={{}} />
      </div>
    </div>
  );
};
