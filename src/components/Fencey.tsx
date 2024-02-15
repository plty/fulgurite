import _reduce from "lodash/reduce";

export const shortnames = {
  fastIntel: [
    "-std=c++23",
    ...["-Wpedantic", "-Wall", "-Wextra", "-Wconversion", "-Werror"],
    "-O3",
    "-march=sapphirerapids",
  ],
  fastAmd: [
    "-std=c++23",
    ...["-Wpedantic", "-Wall", "-Wextra", "-Wconversion", "-Werror"],
    "-O3",
    "-march=znver4",
  ],
  asan: ["-fsanitize=address", "-fno-omit-frame-pointer"],
  tsan: ["-fsanitize=thread"],
  msan: ["-fsanitize=memory"],
  ubsan: ["-fsanitize=undefined"],
  dfsan: ["-fsanitize=dataflow"],
  lsan: ["-fsanitize=leak"],
} as { [k: string]: string[] };

type FenceConfig = {
  lang: string;
  compileOpts: string[];
  filename: string;
  ins: [number, number][];
  del: [number, number][];
  lineNumber: boolean;
  readonly: boolean;
};

const defaultConfig = {
  lang: "cpp",
  compileOpts: [],
  filename: "",
  ins: [],
  del: [],
  lineNumber: true,
  readonly: false,
} satisfies FenceConfig;

export const parseInfo = (s: string) => {
  const [langWithOpt, ...rest] = s.split(";");
  const regex = /^(\w+)(?:\[(.*)\])?$/;
  const [_full, lang, compileOptShorts] = regex.exec(langWithOpt) ?? [];
  const compileOpts = compileOptShorts
    ?.split(",")
    .flatMap((x) => shortnames[x] ?? []);
  return _reduce(
    rest,
    (acc, r) => {
      const [k, v] = r.split("=");
      if (k === "title") {
        return { ...acc, filename: v };
      } else if (k === "ins") {
        return {
          ...acc,
          ins: v.split(",").map((x): [number, number] => {
            const [start, end] = x.split("-");
            return [+start, +end];
          }),
        };
      } else if (k === "del") {
        return {
          ...acc,
          del: v.split(",").map((x): [number, number] => {
            const [start, end] = x.split("-");
            return [+start, +end];
          }),
        };
      }
      return acc;
    },
    {
      ...defaultConfig,
      lang,
      compileOpts,
    } as FenceConfig,
  );
};
