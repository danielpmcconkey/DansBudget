import React from "react";
import { ResizableBox as ReactResizableBox } from "react-resizable";

import "react-resizable/css/styles.css";

export default function ResizableBox({
    children,
    style = {},
    className
}) {
    return (
        <>

            <ReactResizableBox
                width={700}
                height={350}
                handleSize={[50, 50]}
            >
                <div
                    style={{
                        ...style,
                        width: "100%",
                        height: "100%"
                    }}
                    className={className}
                >
                    {children}
                </div>
            </ReactResizableBox>

        </>
    );
}
