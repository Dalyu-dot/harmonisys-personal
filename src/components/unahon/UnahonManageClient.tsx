'use client';

import { useState } from 'react';
import type { Session } from 'next-auth';
import type { UnahonProps } from '@/types/Unahon';
import UnahonManagement from '@/components/unahon/UnahonManagement';
import UnahonForm from '@/components/unahon/UnahonForm';

interface UnahonManageClientProps {
    session: Session;
}

export default function UnahonManageClient({
    session,
}: UnahonManageClientProps) {
    const [isViewing, setIsViewing] = useState(false);
    const [selectedProps, setSelectedProps] = useState<
        UnahonProps | undefined
    >();

    const handleUnahonStateChange = (
        viewing: boolean,
        reassessing: boolean,
        props?: UnahonProps
    ) => {
        if (viewing && props) {
            setIsViewing(true);
            setSelectedProps(props);
            return;
        }

        if (reassessing) {
            return;
        }
    };

    const handleBack = () => {
        setIsViewing(false);
        setSelectedProps(undefined);
    };

    if (isViewing && selectedProps) {
        return (
            <UnahonForm {...selectedProps} onReturnToManagement={handleBack} />
        );
    }

    return (
        <UnahonManagement
            session={session}
            onUnahonStateChange={handleUnahonStateChange}
        />
    );
}
