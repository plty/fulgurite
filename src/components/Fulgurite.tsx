import _fromPairs from "lodash/fromPairs";
import _uniq from "lodash/uniq";
import { compile, type CompileOutput } from "$utils/godbolt";
import { StreamLanguage } from "@codemirror/language";
import { gas } from "@codemirror/legacy-modes/mode/gas";

import { Sabre } from "$components/Sabre";
import { TopLevelProvider } from "$components/TopLevelProvider";
import { useHintedPromise } from "$hooks/usePromise";
import { cppCode } from "$utils/constants";
import { Blox } from "$components/Blox";

const asmLanguage = StreamLanguage.define(gas);

const Fulgurite = ({
  code,
  hint,
}: {
  code: string;
  setCode: (_: string) => void;
  hint: { [code: string]: CompileOutput };
}) => {
  const { value: realData } = useHintedPromise(
    hint,
    () =>
      compile(["c++", "clang1701"], code, {
        opts: "-std=c++2b -O3 -march=sapphirerapids",
        asmSyntax: "intel",
      }),
    code,
  );

  const data = realData || hint[code];
  type ASMMeta = { file: string | null; line: number } | null;
  const asmsrc = (data?.asm ?? [])
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
        "grid grid-cols-1 place-items-stretch space-y-2 text-sm md:space-y-0 lg:grid-cols-2"
      }
    >
      <Blox lang="cpp" code={code} lineGroup={lineGroup} />
      <Sabre
        lang="asm"
        code={data?.asm?.map((line) => line.text).join("\n") ?? "<Compiling>"}
        parserHint={{ asm: asmLanguage }}
        lineGroup={_fromPairs(
          asmsrc.map(([asmLine, srcLine]) => [asmLine, lineGroup[srcLine]]),
        )}
      />
    </div>
  );
};

export const FulguriteIsland = ({
  hint,
}: {
  hint: { [code: string]: CompileOutput };
}) => (
  <TopLevelProvider>
    <Fulgurite hint={hint} code={cppCode} setCode={() => {}} />
  </TopLevelProvider>
);

export default FulguriteIsland;
