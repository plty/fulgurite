import { oneDarkHighlightStyle } from "@codemirror/theme-one-dark";

import { StaticBlox } from "$components/StaticBlox";
import { usePromise } from "$hooks/usePromise";

type Lang = "rust" | "cpp" | "asm";
type BloxProp = {
  code: string;
  lang: Lang;
  lineGroup: { [line: number]: number };
  onChange?: (_: string) => void;
  readonly?: boolean;
};

const Blox: React.FC<BloxProp> = ({
  code,
  lang,
  lineGroup,
  onChange,
  readonly,
}) => {
  const { state, value: DynamicBlox } = usePromise(
    async () => (await import("./DynamicBlox")).DynamicBlox,
    [],
  );

  return (
    <>
      {state === "resolve" && (
        <DynamicBlox
          code={code}
          lang={lang}
          lineGroup={lineGroup}
          onChange={onChange}
          readonly={readonly}
        />
      )}
      {state !== "resolve" && (
        <StaticBlox
          code={code}
          lang={lang}
          lineGroup={lineGroup}
          highlightStyle={oneDarkHighlightStyle}
        />
      )}
    </>
  );
};

export default Blox;
