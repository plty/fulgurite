import {StrictMode} from "react";

export const TopLevelProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    return <StrictMode>{children}</StrictMode>;
};
