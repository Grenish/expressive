import { manifest } from "@expressive/manifest";

export const components = manifest.filter((item) => item.type === "component" && !item.internal);

export const titles: Record<string, string> = {
  button: "Button",
  "icon-button": "Icon button",
  fab: "FAB",
  chip: "Chips",
  card: "Card",
  dialog: "Dialog",
  checkbox: "Checkbox",
  "radio-group": "Radio group",
  slider: "Slider",
  switch: "Switch",
  "text-field": "Text field",
  "navigation-bar": "Navigation bar",
  "navigation-rail": "Navigation rail",
  "top-app-bar": "Top app bar",
  progress: "Progress",
  snackbar: "Snackbar",
  tooltip: "Tooltip",
};

export const groups: Array<{ title: string; items: string[] }> = [
  { title: "Actions", items: ["button", "icon-button", "fab", "chip"] },
  { title: "Selection & input", items: ["checkbox", "radio-group", "slider", "switch", "text-field"] },
  { title: "Navigation", items: ["navigation-bar", "navigation-rail", "top-app-bar"] },
  { title: "Containment", items: ["card", "dialog"] },
  { title: "Communication", items: ["progress", "snackbar", "tooltip"] },
];
