// yoinked from @uiw/codemirror-theme-nord

import { tags } from "@lezer/highlight";

import { createTheme } from "$components/editor/theme";
import { StyleModule } from "style-mod";

export const {
    extension: nord,
    themeStyle: nordTheme,
    highlightStyle: nordHighlight,
} = (() => {
    StyleModule.setCount(1 << 10);
    return createTheme({
        theme: "dark",
        settings: {
            background: "#2e3440",
            foreground: "#FFFFFF",
            caret: "#FFFFFF",
            selection: "#4b556a",
            selectionMatch: "#4b556a",
            gutterBackground: "#2e3440",
            gutterForeground: "#4c566a",
            lineHighlight: "#4c566a29",
        },
        styles: [
            { tag: tags.keyword, color: "#5e81ac" },
            {
                tag: [
                    tags.name,
                    tags.deleted,
                    tags.character,
                    tags.propertyName,
                    tags.macroName,
                ],
                color: "#88c0d0",
            },
            { tag: [tags.variableName], color: "#8fbcbb" },
            { tag: [tags.function(tags.variableName)], color: "#8fbcbb" },
            { tag: [tags.labelName], color: "#81a1c1" },
            {
                tag: [
                    tags.color,
                    tags.constant(tags.name),
                    tags.standard(tags.name),
                ],
                color: "#5e81ac",
            },
            {
                tag: [tags.definition(tags.name), tags.separator],
                color: "#a3be8c",
            },
            { tag: [tags.brace], color: "#8fbcbb" },
            {
                tag: [tags.annotation],
                color: "#d30102",
            },
            {
                tag: [
                    tags.number,
                    tags.changed,
                    tags.annotation,
                    tags.modifier,
                    tags.self,
                    tags.namespace,
                ],
                color: "#b48ead",
            },
            {
                tag: [tags.typeName, tags.className],
                color: "#ebcb8b",
            },
            {
                tag: [tags.operator, tags.operatorKeyword],
                color: "#a3be8c",
            },
            {
                tag: [tags.tagName],
                color: "#b48ead",
            },
            {
                tag: [tags.squareBracket],
                color: "#bf616a",
            },
            {
                tag: [tags.angleBracket],
                color: "#d08770",
            },
            {
                tag: [tags.attributeName],
                color: "#ebcb8b",
            },
            {
                tag: [tags.regexp],
                color: "#5e81ac",
            },
            {
                tag: [tags.quote],
                color: "#b48ead",
            },
            { tag: [tags.string], color: "#a3be8c" },
            {
                tag: tags.link,
                color: "#a3be8c",
                textDecoration: "underline",
                textUnderlinePosition: "under",
            },
            {
                tag: [tags.url, tags.escape, tags.special(tags.string)],
                color: "#8fbcbb",
            },
            { tag: [tags.meta], color: "#88c0d0" },
            { tag: [tags.monospace], color: "#d8dee9", fontStyle: "italic" },
            { tag: [tags.comment], color: "#4c566a", fontStyle: "italic" },
            { tag: tags.strong, fontWeight: "bold", color: "#5e81ac" },
            { tag: tags.emphasis, fontStyle: "italic", color: "#5e81ac" },
            { tag: tags.strikethrough, textDecoration: "line-through" },
            { tag: tags.heading, fontWeight: "bold", color: "#5e81ac" },
            {
                tag: tags.special(tags.heading1),
                fontWeight: "bold",
                color: "#5e81ac",
            },
            { tag: tags.heading1, fontWeight: "bold", color: "#5e81ac" },
            {
                tag: [tags.heading2, tags.heading3, tags.heading4],
                fontWeight: "bold",
                color: "#5e81ac",
            },
            {
                tag: [tags.heading5, tags.heading6],
                color: "#5e81ac",
            },
            {
                tag: [tags.atom, tags.bool, tags.special(tags.variableName)],
                color: "#d08770",
            },
            {
                tag: [tags.processingInstruction, tags.inserted],
                color: "#8fbcbb",
            },
            {
                tag: [tags.contentSeparator],
                color: "#ebcb8b",
            },
            {
                tag: tags.invalid,
                color: "#434c5e",
                borderBottom: `1px dotted #d30102`,
            },
        ],
    });
})();
