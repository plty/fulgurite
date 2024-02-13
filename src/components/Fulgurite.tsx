import _fromPairs from "lodash/fromPairs";
import _toPairs from "lodash/toPairs";
import _uniq from "lodash/uniq";

import { Blox } from "$components/Blox";
import { StaticBlox } from "$components/StaticBlox";
import { TopLevelProvider } from "$components/TopLevelProvider";
import { usePromise } from "$hooks/usePromise";
import { cppCode } from "$utils/constants";
import { compile, type CompileOutput } from "$utils/godbolt";

const Fulgurite = ({
  code,
  hint,
}: {
  code: string;
  setCode: (_: string) => void;
  hint: { [code: string]: CompileOutput };
}) => {
  const { value: realData } = usePromise(
    () =>
      compile(["c++", "clang1701"], code, {
        opts: "-std=c++2b -O3 -march=sapphirerapids",
        asmSyntax: "intel",
      }),
    [code],
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
      <StaticBlox
        lang="asm"
        code={data?.asm?.map((line) => line.text).join("\n") ?? "<Compiling>"}
        parserHint={{}}
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
