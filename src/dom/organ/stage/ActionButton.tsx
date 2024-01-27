"use client";

export interface ActionButtonProps {
    title: string;
    icon: string;
    onClick: any;
}

export const ActionButton = ({ title, icon, onClick }: ActionButtonProps) => {
    return (
        <div className="pa-2 opaci-chov--50 " onClick={onClick} title={title}>
            <button className="border-white box-shadow-2-b bord-r-100p h-50px w-50px noborder bg-w-50 bg-glass-10 noclick tx-lgx ">{icon}</button>
        </div>
    );
};
