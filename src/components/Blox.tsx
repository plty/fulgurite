import { type FenceConfig } from "$components/Fencey";
import { SabreCore } from "$components/Sabre";
import { highlighter } from "$components/editor/lang-support";
import { usePromise } from "$hooks/usePromise";

type BloxProp = {
    code: string;
    fenceConfig: FenceConfig;
    lineGroup: { [line: number]: number };
};

export const Blox = ({ code, fenceConfig, lineGroup }: BloxProp) => {
    const { lang, readonly } = fenceConfig;
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
                <SabreCore
                    code={code}
                    parserHint={{}}
                    fenceConfig={fenceConfig}
                    lineGroup={lineGroup}
                />
            )}
        </>
    );
};
