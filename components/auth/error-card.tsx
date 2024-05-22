import { TriangleAlert } from "lucide-react";

import { CardWrapper } from "@/components/auth/card-wrapper";

export const ErrorCard = () => {
    return (
        <CardWrapper
            headerLabel="Упс! Что-то пошло не так!"
            backButtonHref="/auth/login"
            backButtonLabel="Back to login"
        >
            <div className="w-full flex justify-center items-center">
                <TriangleAlert className="text-destructive" />
            </div>
        </CardWrapper>
    );
};