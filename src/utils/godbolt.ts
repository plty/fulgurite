import axios from "axios";

export const godbolt = axios.create({
    baseURL: "https://godbolt.org/api",
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json ",
    },
});

export type CompileOpts = {
    opts: string;
    asmSyntax: "intel" | "at&t";
};

export type CompileOutput = {
    code: number;
    stdout: {
        text: string;
    }[];
    stderr: {
        text: string;
    }[];
    asm: {
        text: string;
        source: { file: string | null; line: number } | null;
    }[];
};
export type CompilableLang = "cpp" | "rust";

export type Compiler =
    | ["cpp", "clang1701"]
    | ["cpp", "g132"]
    | ["rust", "r1750"];

export const compile = async (
    [_lang, compiler]: Compiler,
    code: string,
    opts?: CompileOpts,
): Promise<CompileOutput> => {
    const r = await godbolt.post(`/compiler/${compiler}/compile`, {
        allowStoreCodeDebug: false,
        bypassCache: false,
        compiler: compiler,
        source: code,
        options: {
            filters: {
                binary: false,
                commentOnly: true,
                demangle: true,
                directives: true,
                execute: true,
                intel: opts?.asmSyntax === "intel",
                labels: true,
                libraryCode: false,
                trim: false,
            },
            userArguments: opts?.opts,
        },
    });
    return r.data;
};
