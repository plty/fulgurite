import { cppLanguage } from "@codemirror/lang-cpp";
import { jsxLanguage, tsxLanguage } from "@codemirror/lang-javascript";
import { rustLanguage } from "@codemirror/lang-rust";
import { StreamLanguage } from "@codemirror/language";
import { gas } from "@codemirror/legacy-modes/mode/gas";
import _reduce from "lodash/reduce";

import type { FenceConfig } from "$components/Fencey";
import { Sabre } from "$components/Sabre";

export const parser = {
    asm: StreamLanguage.define(gas),
    cpp: cppLanguage,
    jsx: jsxLanguage,
    rust: rustLanguage,
    tsx: tsxLanguage,
};

type FoilProp = {
    code: string;
    fenceConfig: FenceConfig;
    lineGroup: { [line: number]: number };
};

export const Foil = ({ code, fenceConfig, lineGroup }: FoilProp) => (
    <Sabre
        code={code}
        fenceConfig={fenceConfig}
        parserHint={parser}
        lineGroup={lineGroup}
    />
);
