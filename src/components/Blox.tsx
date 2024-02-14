import { Sabre } from "$components/Sabre";
import { usePromise } from "$hooks/usePromise";
import { highlighter, type Lang } from "$components/editor/lang-support";

type BloxProp = {
  code: string;
  lang: Lang;
  lineGroup: { [line: number]: number };
  readonly?: boolean;
};

export const Blox = ({ code, lang, lineGroup, readonly }: BloxProp) => {
  const { state: epeeState, value: Epee } = usePromise(
    async () => (await import("$components/Epee")).Epee,
    [],
  );
  const { state: hlState, value: hl } = usePromise(highlighter[lang], [lang]);

  return (
    <>
      {epeeState === "resolve" && hlState == "resolve" && (
        <Epee
          code={code}
          lang={lang}
          highlighterHint={{ [lang]: hl }}
          lineGroup={lineGroup}
          onChange={() => {}}
          readonly={readonly}
        />
      )}
      {(epeeState !== "resolve" || hlState !== "resolve") && (
        <Sabre
          code={code}
          lang={lang}
          parserHint={{}}
          editorConfig={{}}
          lineGroup={lineGroup}
        />
      )}
    </>
  );
};
