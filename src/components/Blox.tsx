import { Sabre } from "$components/Sabre";
import { usePromise } from "$hooks/usePromise";
import { type Lang } from "$components/editor/lang-support";

type BloxProp = {
  code: string;
  lang: Lang;
  lineGroup: { [line: number]: number };
  // onChange?: (_: string) => void;
  readonly?: boolean;
};

export const Blox = ({
  code,
  lang,
  lineGroup,
  // onChange: _onChange,
  readonly,
}: BloxProp) => {
  const { state, value: Epee } = usePromise(
    async () => (await import("$components/Epee")).Epee,
    [],
  );

  return (
    <>
      {state === "resolve" && (
        <Epee
          code={code}
          lang={lang}
          lineGroup={lineGroup}
          onChange={() => {}}
          readonly={readonly}
        />
      )}
      {state !== "resolve" && (
        <Sabre code={code} lang={lang} parserHint={{}} lineGroup={lineGroup} />
      )}
    </>
  );
};
