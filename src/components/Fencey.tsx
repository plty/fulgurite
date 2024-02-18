import _reduce from "lodash/reduce";

import { type Lang } from "$components/editor/lang-support";
import { type CompilableLang } from "$utils/godbolt";

const extendedFlags = {
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

export type FenceConfig = {
    lang: Lang;
    filename: string;
    ins: [number, number][];
    del: [number, number][];
    frame: "tabbed" | "none";
    lineNumber: boolean;
    readonly: boolean;
};

export type FulguriteConfig = {
    lang: CompilableLang;
    compileOpts: string[];
    filename: string;
};

export type Config =
    | {
          state: "fence";
          config: FenceConfig;
      }
    | {
          state: "fulgurite";
          config: FulguriteConfig;
      };

const defaultFenceConfig = {
    lang: "cpp",
    filename: "",
    ins: [],
    del: [],
    lineNumber: true,
    readonly: false,
    frame: "tabbed",
} satisfies FenceConfig;

const defaultFulguriteConfig = {
    lang: "cpp",
    compileOpts: [],
    filename: "",
} satisfies FulguriteConfig;

const parseFenceConfig = (init: FenceConfig, rest: string[]) => {
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
            } else if (k == "linenumber") {
                return { ...acc, lineNumber: v === "true" };
            } else if (k == "readonly") {
                return { ...acc, readonly: v === "true" };
            } else if (k == "framed") {
                return { ...acc, framed: v as "tabbed" | "framed" | "none" };
            }
            return acc;
        },
        init,
    );
};

const parseFulguriteConfig = (init: FulguriteConfig, rest: string[]) => {
    return _reduce(
        rest,
        (acc, r) => {
            const [k, v] = r.split("=");
            if (k === "title") {
                return { ...acc, filename: v };
            }
            return acc;
        },
        init,
    );
};

export const parseInfo = (s: string): Config => {
    const [langWithOpt, ...rest] = s.split(";");
    const regex = /^(\w+)(?:\[(.*)\])?$/;
    const [_full, lang, compileOptShorts] = regex.exec(langWithOpt) ?? [];
    if (compileOptShorts === undefined) {
        return {
            state: "fence",
            config: parseFenceConfig(
                { ...defaultFenceConfig, lang: lang as Lang },
                rest,
            ),
        };
    }

    const compileOpts = compileOptShorts
        ?.split(",")
        .flatMap((x) => extendedFlags[x]);
    return {
        state: "fulgurite",
        config: parseFulguriteConfig(
            {
                ...defaultFulguriteConfig,
                lang: lang as CompilableLang,
                compileOpts,
            },
            rest,
        ),
    };
};
