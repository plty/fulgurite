import { useEffect, useRef } from "react";

import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { Line, RangeSetBuilder, type Extension } from "@codemirror/state";
import {
    crosshairCursor,
    Decoration,
    drawSelection,
    dropCursor,
    EditorView,
    highlightActiveLineGutter,
    highlightSpecialChars,
    keymap,
    lineNumbers,
    ViewPlugin,
    ViewUpdate,
    type DecorationSet,
} from "@codemirror/view";

import {
    highlighter,
    type EagerHighlighter,
    type Lang,
} from "$components/editor/lang-support";
import { nord } from "$components/editor/nord";
import { useHintedPromise } from "$hooks/usePromise";
import {
    bracketMatching,
    foldKeymap,
    indentOnInput,
} from "@codemirror/language";

const visibleLines = (view: EditorView) =>
    view.visibleRanges.flatMap(({ from, to }): Line[] => {
        const lines = [];
        for (let pos = from; pos <= to; ) {
            const line = view.state.doc.lineAt(pos);
            lines.push(line);
            pos = line.to + 1;
        }
        return lines;
    });

const showStripes = (lineGroup: { [line: number]: number }): Extension => {
    const decorate = (
        view: EditorView,
        lineGroup: { [line: number]: number },
    ) => {
        const colorOf = (v: number, al: number) =>
            `hsla(${(v * 37) % 360}, 50%, 50%, ${al}%)`;

        const decorationOf = (line: number): Decoration =>
            Decoration.line({
                attributes: {
                    style: `background-color: ${colorOf(line, 15)}`,
                },
            });

        return visibleLines(view)
            .filter((line) => line.number in lineGroup)
            .map((line: Line): [Line, Decoration] => [
                line,
                decorationOf(lineGroup[line.number]),
            ])
            .reduce((b, [l, d]) => {
                b.add(l.from, l.from, d);
                return b;
            }, new RangeSetBuilder<Decoration>())
            .finish();
    };

    return ViewPlugin.fromClass(
        class {
            decorations: DecorationSet;
            constructor(view: EditorView) {
                this.decorations = decorate(view, lineGroup);
            }
            update(update: ViewUpdate) {
                if (!update.docChanged && !update.viewportChanged) return;
                this.decorations = decorate(update.view, lineGroup);
            }
        },
        {
            decorations: (v) => v.decorations,
        },
    );
};

const baseExtensions = [
    lineNumbers(),
    highlightActiveLineGutter(),
    highlightSpecialChars(),
    history(),
    drawSelection(),
    dropCursor(),
    indentOnInput(),
    bracketMatching(),
    crosshairCursor(),
    keymap.of([...defaultKeymap, ...historyKeymap, ...foldKeymap]),
];

type EpeeProp = {
    code: string;
    lang: Lang;
    highlighterHint: Partial<EagerHighlighter>;
    lineGroup: { [line: number]: number };
    onChange?: (_: string) => void;
    readonly?: boolean;
};
export const Epee = ({
    code,
    lang,
    highlighterHint,
    lineGroup,
    onChange: _onChange,
    readonly,
}: EpeeProp) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const editorRef = useRef<EditorView | null>(null);
    const { state, value: langExt } = useHintedPromise(
        highlighterHint,
        () => highlighter[lang](),
        lang,
    );
    useEffect(() => {
        const editor = new EditorView({
            doc: code,
            extensions: [
                ...baseExtensions,
                showStripes(lineGroup),
                nord,
                ...(state === "resolve" ? [langExt] : []),
                EditorView.contentAttributes.of({
                    contenteditable: `${!readonly}`,
                }),
            ],
            parent: ref.current!,
        });
        editorRef.current = editor;
        return () => editor.destroy();
    });
    return <div className="max-h-[400px] overflow-y-auto" ref={ref}></div>;
};

export default Epee;
