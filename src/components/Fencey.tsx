export type EditorConfig = {
  lineNumber: boolean;
  readonly: boolean;
};

export const defaultEditorConfig = {
  lineNumber: true,
  readonly: false,
};

export const normalizeEditorConfig = (
  p: Partial<EditorConfig>,
): EditorConfig => ({
  ...defaultEditorConfig,
  ...p,
});
