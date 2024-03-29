import { StreamLanguage } from "@codemirror/language";

import { gas } from "@codemirror/legacy-modes/mode/gas";
import _fromPairs from "lodash/fromPairs";
import _uniq from "lodash/uniq";

import { Blox } from "$react/Blox";
import { type FulguriteConfig } from "$components/Fencey";
import { SabreCore } from "$react/Sabre";
import { useHintedPromise } from "$hooks/usePromise";
import { compile, type CompileOutput } from "$utils/godbolt";

const asmLanguage = StreamLanguage.define(gas);

type FulguriteProp = {
    code: string;
    setCode: (_: string) => void;
    hint: { [code: string]: CompileOutput };
    fulguriteConfig: FulguriteConfig;
};

export const Fulgurite = ({ code, hint, fulguriteConfig }: FulguriteProp) => {
    const { value: compileResult } = useHintedPromise(
        hint,
        () =>
            compile(["cpp", "clang1701"], code, {
                opts: fulguriteConfig.compileOpts.join(" "),
                asmSyntax: "intel",
            }),
        code,
    );

    type ASMMeta = { file: string | null; line: number } | null;
    const asmsrc = (compileResult?.asm ?? [])
        .map(({ source }, i): [ASMMeta, number] => [source, i + 1])
        .filter(([source, _]) => source && source?.file == null)
        .map(([source, i]) => [i, source!.line]);
    const lineGroup = _fromPairs(
        _uniq(asmsrc.map(([_, srcLine]) => srcLine)).map((srcLine, i) => [
            srcLine,
            i,
        ]),
    );

    return (
        <div
            className={
                "grid grid-cols-1 place-items-stretch space-y-2 text-sm lg:grid-cols-2 lg:space-y-0"
            }
        >
            <Blox
                code={code}
                lineGroup={lineGroup}
                fenceConfig={{
                    ...fulguriteConfig,
                    ins: [],
                    del: [],
                    frame: "none",
                    lineNumber: true,
                    readonly: true,
                }}
            />
            <div className="border-polar-700 border-t lg:border-l lg:border-t-0">
                <SabreCore
                    code={
                        compileResult?.asm
                            ?.map((line) => line.text)
                            ?.join("\n") ?? "<Compiling>"
                    }
                    parserHint={{ asm: asmLanguage }}
                    fenceConfig={{
                        ...fulguriteConfig,
                        lang: "asm",
                        filename: "out.asm",
                        ins: [],
                        del: [],
                        frame: "none",
                        lineNumber: true,
                        readonly: true,
                    }}
                    lineGroup={_fromPairs(
                        asmsrc.map(([asmLine, srcLine]) => [
                            asmLine,
                            lineGroup[srcLine],
                        ]),
                    )}
                />
            </div>
        </div>
    );
};
