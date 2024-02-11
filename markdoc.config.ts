import { defineMarkdocConfig, nodes, component } from "@astrojs/markdoc/config";

export default defineMarkdocConfig({
  nodes: {
    fence: {
      ...nodes.fence,
      attributes: {
        content: { type: String, render: true, required: true },
        language: { type: String, render: true, required: false },
        process: { type: Boolean, render: true, default: true },
      },
      render: component("$components/marco/Fence.astro"),
      transform: undefined,
    },
    heading: {
      ...nodes.heading,
      render: component("$components/marco/Heading.astro"),
    },
  },
});
