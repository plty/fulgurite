import React, { useMemo, useState } from "react";

import type { HighlightStyle, Language } from "@codemirror/language";
import { Line, RangeSet, RangeSetBuilder, Text } from "@codemirror/state";
import { Decoration, baseDarkID, baseThemeID } from "@codemirror/view";
import { highlightTree } from "@lezer/highlight";
import _range from "lodash/range";

import { type FenceConfig } from "$components/Fencey";
import { parser, type EagerParser } from "$components/editor/lang-support";
import { nordHighlight } from "$components/editor/nord";
import { useHintedPromise } from "$hooks/usePromise";
import { zip } from "$utils/fn";

const decorations = (
    lang: Language,
    highlightStyle: HighlightStyle,
    code: string,
): RangeSet<Decoration> => {
    const tree = lang.parser.parse(code);
    const builder = new RangeSetBuilder<Decoration>();
    highlightTree(tree, highlightStyle, (from, to, style) => {
        builder.add(from, to, Decoration.mark({ class: style }));
    });
    return builder.finish();
};

type Decoz = { tag: string; cls: string; range: { s: number; e: number } };
const marks = (decors: RangeSet<Decoration>, meta: Line): Decoz[] => {
    type DecorValue = {
        tagName: string;
        class: string;
    };

    const g = function* (line: Line): Generator<Decoz> {
        for (
            let curs = decors.iter(line.from);
            curs.value && curs.from < line.to;
            curs.next()
        ) {
            const decoration = curs.value as unknown as DecorValue;
            yield {
                tag: decoration.tagName,
                cls: decoration.class,
                range: {
                    s: Math.max(curs.from, line.from) - line.from,
                    e: Math.min(curs.to, line.to) - line.from,
                },
            };
        }
    };

    return [...g(meta)];
};

const CodeLine = ({
    line,
    marks,
    bg,
    onClick,
}: {
    line: string;
    marks: Decoz[];
    bg: string;
    onClick: () => void;
}) => {
    if (marks.length == 0) {
        return (
            <div
                className="cm-line transition-colors duration-300"
                style={bg ? { backgroundColor: bg } : {}}
                onClick={onClick}
            >
                {/* TODO: use tag */}
                <span>{line}</span>
                <br />
            </div>
        );
    }

    const [f, l] = [marks[0], marks[marks.length - 1]];
    return (
        <div
            className="cm-line transition-colors duration-300"
            style={bg ? { backgroundColor: bg } : {}}
            onClick={onClick}
        >
            <span key={"start"}>{line.slice(0, f.range.s)}</span>
            <span className={f.cls}>{line.slice(f.range.s, f.range.e)}</span>
            {zip(marks, marks.slice(1)).map(([prev, next], i) => {
                const {
                    range: { s: _ps, e: pe },
                } = prev;
                const {
                    range: { s: ns, e: ne },
                } = next;
                return (
                    <React.Fragment key={i}>
                        <span>{line.slice(pe, ns)}</span>
                        <span className={next.cls}>{line.slice(ns, ne)}</span>
                    </React.Fragment>
                );
            })}
            <span>{line.slice(l.range.e)}</span>
            <br />
        </div>
    );
};

type SabreProp = {
    code: string;
    fenceConfig: FenceConfig;
    parserHint: Partial<EagerParser>;
    lineGroup: { [line: number]: number };
};
export const SabreCore = ({
    code,
    fenceConfig,
    parserHint,
    lineGroup: lg,
}: SabreProp) => {
    const { lineNumber, lang } = fenceConfig;
    const highlightStyle = nordHighlight;
    const [hlGroup, setHlGroup] = useState(-1);
    const { state, value: langParser } = useHintedPromise(
        parserHint,
        parser[lang],
        lang,
    );
    const colorOf = (v: number, al: number) =>
        `hsla(${(v * 37) % 360}, 50%, 50%, ${al}%)`;
    const decors = useMemo(
        () =>
            state === "resolve"
                ? decorations(langParser, highlightStyle, code)
                : new RangeSetBuilder<Decoration>().finish(),
        [langParser, highlightStyle, code],
    );
    const lines = Text.of(code.split("\n"));
    {
        /* ͼsg is currently hackish, parseInt("sg", 36) == 1024 which is basically themeID of nord. */
    }
    return (
        <div className={`cm-editor gutter ${baseThemeID} ${baseDarkID} ͼsg`}>
            <div className="cm-scroller">
                <div className="cm-gutters select-none">
                    {lineNumber && (
                        <div className="cm-gutter cm-lineNumbers">
                            {_range(lines.lines).map((i) => (
                                // HACK: investigate root issue of 4px magic
                                <div
                                    key={i}
                                    className="cm-gutterElement"
                                    style={i == 0 ? { marginTop: "4px" } : {}}
                                >
                                    {i + 1}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div key={"content"} className="cm-content">
                    {_range(lines.lines)
                        .map((i): [Line, number] => [
                            lines.line(i + 1),
                            lg[i + 1],
                        ])
                        .map(([line, g]) => (
                            <CodeLine
                                key={line.number}
                                line={lines.sliceString(line.from, line.to)}
                                marks={marks(decors, line)}
                                bg={
                                    line.number in lg
                                        ? colorOf(g, g == hlGroup ? 35 : 15)
                                        : "transparent"
                                }
                                onClick={() => setHlGroup(g)}
                            ></CodeLine>
                        ))}
                </div>
            </div>
        </div>
    );
};

export const Sabre = ({
    code,
    fenceConfig,
    parserHint,
    lineGroup,
}: SabreProp) => {
    return fenceConfig.frame == "tabbed" ? (
        <div>
            <div className="border-polar-600 flex border-x border-t">
                <div className="border-f-bluish bg-polar-800 line-clamp-1 border-t-2 px-6 py-1 font-mono">
                    {fenceConfig.filename}
                </div>
                <div className="border-polar-600 bg-polar-700 flex-grow border-b border-l" />
            </div>
            <div className="border-polar-600 border-x border-b text-sm">
                <SabreCore
                    code={code}
                    lineGroup={lineGroup}
                    fenceConfig={fenceConfig}
                    parserHint={parserHint}
                />
            </div>
        </div>
    ) : (
        <SabreCore
            code={code}
            lineGroup={lineGroup}
            fenceConfig={fenceConfig}
            parserHint={parserHint}
        />
    );
};
