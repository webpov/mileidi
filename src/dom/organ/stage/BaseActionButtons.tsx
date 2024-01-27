"use client";
import { ActionButton } from "./ActionButton";
import { DEFAULT_ICON_LOOKUP } from "./MainStage";

export const BaseActionButtons = ({calls}:any) => {
    const handleButtonClick = (icon: string) => {
        calls.triggerClickedAction(DEFAULT_ICON_LOOKUP[icon]);
    };

    return (
        <div className="pa-2">
            <ActionButton title={DEFAULT_ICON_LOOKUP["💰"].toUpperCase()}
                icon="💰" onClick={() => handleButtonClick('💰')}
            />
            <ActionButton title={DEFAULT_ICON_LOOKUP["🌐"].toUpperCase()}
                icon="🌐" onClick={() => handleButtonClick('🌐')}
            />
            <ActionButton title={DEFAULT_ICON_LOOKUP["⚖️"].toUpperCase()}
                icon="⚖️" onClick={() => handleButtonClick('⚖️')}
            />
        </div>
    );
};
