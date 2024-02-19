import React from "react";

export const TopLevelProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    return <React.StrictMode>{children}</React.StrictMode>;
};
