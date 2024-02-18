import { type DependencyList, useEffect, useState, useMemo } from "react";

type Pending = {
    state: "pending";
    value: undefined;
    error: undefined;
};

type Resolve<T> = {
    state: "resolve";
    value: T;
    error: undefined;
};

type Reject<E> = {
    state: "reject";
    value: undefined;
    error: E;
};

type UsePromiseResponse<T, E = any> = Pending | Resolve<T> | Reject<E>;

const pending = (): Pending => ({
    state: "pending",
    value: undefined,
    error: undefined,
});
const reject = function <E>(e: E): Reject<E> {
    return { state: "reject", value: undefined, error: e };
};
const resolve = function <T>(v: T): Resolve<T> {
    return { state: "resolve", value: v, error: undefined };
};

export const useHintedPromise = function <T extends PropertyKey, U>(
    hint: { [P in T]?: U },
    f: () => Promise<U>,
    d: T,
): UsePromiseResponse<U> {
    const [state, setState] = useState<UsePromiseResponse<U>>(() => {
        const hinted = hint[d];
        return hinted ? resolve(hinted) : pending();
    });

    const promise = useMemo(() => {
        const hinted = hint[d];
        if (hinted !== undefined) return Promise.resolve(hinted);
        return f();
    }, [d, hint]);

    useEffect(() => {
        let stale = false;
        promise
            .then((v) => {
                !stale && setState(resolve(v));
            })
            .catch((e) => !stale && setState(reject(e)));
        return () => {
            stale = true;
        };
    }, [promise]);
    return state;
};

export const usePromise = function <T, D extends DependencyList>(
    f: () => Promise<T>,
    deps: D,
): UsePromiseResponse<T> {
    const [state, setState] = useState<UsePromiseResponse<T>>(pending());
    useEffect(() => {
        let stale = false;
        f()
            .then((v) => !stale && setState(resolve(v)))
            .catch((e) => !stale && setState(reject(e)));

        return () => {
            stale = true;
            setState(pending());
        };
    }, deps);
    return state;
};
