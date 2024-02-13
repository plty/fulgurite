import { StaticBlox } from "$components/StaticBlox";
import type { EagerParser, Lang } from "$components/editor/lang-support";
import { cppLanguage } from "@codemirror/lang-cpp";
import { jsxLanguage, tsxLanguage } from "@codemirror/lang-javascript";
import { rustLanguage } from "@codemirror/lang-rust";
import { StreamLanguage } from "@codemirror/language";
import { gas } from "@codemirror/legacy-modes/mode/gas";

export const parser: EagerParser = {
  asm: StreamLanguage.define(gas),
  cpp: cppLanguage,
  jsx: jsxLanguage,
  rust: rustLanguage,
  tsx: tsxLanguage,
};

type VeryStaticBloxProp = {
  code: string;
  lang: Lang;
  lineGroup: { [line: number]: number };
};
export const VeryStaticBlox = ({
  code,
  lang,
  lineGroup,
}: VeryStaticBloxProp) => {
  return (
    <StaticBlox
      code={code}
      lang={lang}
      parserHint={parser}
      lineGroup={lineGroup}
    />
  );
};
