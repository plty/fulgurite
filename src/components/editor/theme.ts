// yoinked from @uiw/codemirror-themes

import {
  HighlightStyle,
  syntaxHighlighting,
  type TagStyle,
} from "@codemirror/language";
import type { Extension } from "@codemirror/state";
import { EditorView } from "codemirror";

type CreateThemeOptions = {
  theme: Theme;
  settings: Settings;
  styles: TagStyle[];
};
type Theme = "light" | "dark";
type Settings = {
  background: string;
  foreground: string;
  caret: string;
  selection: string;
  selectionMatch: string;
  lineHighlight: string;
  gutterBackground: string;
  gutterForeground: string;
  fontFamily?: string;
};

type ThemePack = {
  themeStyle: Extension;
  highlightStyle: HighlightStyle;
  extension: Extension;
};

export const createTheme = ({
  theme,
  settings,
  styles,
}: CreateThemeOptions): ThemePack => {
  const themeOptions: { [key: string]: { [key: string]: string } } = {
    "&": {
      backgroundColor: settings.background,
      color: settings.foreground,
    },
    ".cm-gutters": {
      backgroundColor: settings.gutterBackground,
      foregroundColor: settings.gutterForeground,
    },
    "&.cm-editor.cm-focused": {
      outline: "2px solid transparent",
      outlineOffset: "2px",
    },
    "&.cm-editor .cm-scroller": {
      fontFamily: settings.fontFamily || "monospace",
    },
    ".cm-activeLine": {
      backgroundColor: settings.lineHighlight,
    },
    ".cm-activeLineGutter": {
      backgroundColor: settings.lineHighlight,
    },
    ".cm-content": {
      caretColor: settings.caret,
    },
    ".cm-cursor, .cm-dropCursor": {
      borderLeftColor: settings.caret,
    },
    "&.cm-focused .cm-selectionBackground, & .cm-selectionLayer .cm-selectionBackground, .cm-content ::selection":
      {
        backgroundColor: settings.selection,
      },
    "& .cm-selectionMatch": {
      backgroundColor: settings.selectionMatch,
    },
  };

  const themeStyle = EditorView.theme(themeOptions, {
    dark: theme === "dark",
  });
  const highlightStyle = HighlightStyle.define(styles);
  return {
    themeStyle,
    highlightStyle,
    extension: [themeStyle, syntaxHighlighting(highlightStyle)],
  };
};
