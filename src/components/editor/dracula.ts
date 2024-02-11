// yoinked from @uiw/codemirror-theme-dracula

import { tags } from "@lezer/highlight";

import { createTheme } from "$components/editor/theme";

export const {
  extension: dracula,
  themeStyle: draculaTheme,
  highlightStyle: draculaHighlight,
} = createTheme({
  theme: "dark",
  settings: {
    background: "#282A36",
    foreground: "#F8F8F2",
    caret: "#F8F8F0",
    selection: "rgba(255, 255, 255, 0.1)",
    selectionMatch: "rgba(255, 255, 255, 0.2)",
    gutterBackground: "#282A36",
    gutterForeground: "#6D8A88",
    lineHighlight: "rgba(255, 255, 255, 0.0)",
  },
  styles: [
    { tag: tags.comment, color: "#6272A4" },
    { tag: tags.string, color: "#F1FA8C" },
    { tag: tags.atom, color: "#BD93F9" },
    { tag: tags.meta, color: "#F8F8F2" },
    { tag: [tags.keyword, tags.operator, tags.tagName], color: "#FF79C6" },
    {
      tag: [tags.function(tags.propertyName), tags.propertyName],
      color: "#66D9EF",
    },
    {
      tag: [
        tags.definition(tags.variableName),
        tags.function(tags.variableName),
        tags.className,
        tags.attributeName,
      ],
      color: "#50FA7B",
    },
    { tag: tags.atom, color: "#BD93F9" },
  ],
});
