import * as React from "react";

const UIPanel = React.forwardRef<
    HTMLDivElement,
    Readonly<{ className: string; children: React.ReactNode }>
>((props, ref) => {
    return (
        <div
            {...props}
            className={`absolute z-30 bg-slate-500 ${props.className}`}
            ref={ref}
        />
    );
});
UIPanel.displayName = "UIPanel";

export const GameUI: React.FC = () => {
    return (
        <div className="before:pointer-events-none before:absolute before:z-0 before:h-full before:w-full before:opacity-0">
            <UIPanel className="inset-y-0">
                <div>Menu 1</div>
                <ul>
                    <li>
                        <button>Click Me</button>
                    </li>
                    <li>
                        <button>Click Me</button>
                    </li>
                    <li>
                        <button>Click Me</button>
                    </li>
                    <li>
                        <button>Click Me</button>
                    </li>
                </ul>
            </UIPanel>
            <UIPanel className="inset-y-0 right-0">
                <div>Menu 2</div>
                <ul>
                    <li>
                        <button>Click Me</button>
                    </li>
                    <li>
                        <button>Click Me</button>
                    </li>
                    <li>
                        <button>Click Me</button>
                    </li>
                    <li>
                        <button>Click Me</button>
                    </li>
                </ul>
            </UIPanel>
            <UIPanel className="bottom-0 ml-auto w-full mr-auto">
                <div className="">Menu 3</div>
                <ul className="flex justify-items-center">
                    <li>
                        <button>Click Me</button>
                    </li>
                    <li>
                        <button>Click Me</button>
                    </li>
                    <li>
                        <button>Click Me</button>
                    </li>
                    <li>
                        <button>Click Me</button>
                    </li>
                </ul>
            </UIPanel>
        </div>
    );
};
