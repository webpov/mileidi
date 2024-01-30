"use client";
import React, { useEffect } from 'react';
import { DEFAULT_ICON_LOOKUP } from "./MainStage";

export interface ActionButtonProps {
    title: string;
    icon: string;
    onClick: any;
}

export const ActionButton = ({ title, icon, onClick }: ActionButtonProps) => {
    return (
        <div className="pa-2 opaci-chov--50" onClick={onClick} title={title}>
            <button className="border-white tx-shadow-5 box-shadow-2-b bord-r-100p h-50px w-50px noborder bg-w-50 bg-glass-10 noclick tx-lgx">{icon}</button>
        </div>
    );
};

export const BaseActionButtons = ({ calls }: any) => {
    const handleButtonClick = (icon: string) => {
        calls.triggerClickedAction(DEFAULT_ICON_LOOKUP[icon]);
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const initialLookup: { [key: string]: string } = {
                'A': '💰', // Assuming 'M' is the initial for the action name corresponding to '💰'
                'S': '🌐', // Assuming 'W' is the initial for the action name corresponding to '🌐'
                'D': '⚖️', // Assuming 'S' is the initial for the action name corresponding to '⚖️'
            };

            const actionIcon = initialLookup[event.key.toUpperCase()];
            if (actionIcon) {
                handleButtonClick(actionIcon);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [calls]);

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
