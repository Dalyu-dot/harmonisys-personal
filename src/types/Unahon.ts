import type { AssessmentType } from '@prisma/client';
import type { Session } from 'next-auth';

export interface UnahonProps {
    session: Session;
    isViewOnly: boolean;
    isReassessment: boolean;
    unahonChecklist?: Checklist;
    clientConfidentialForm?: ConfidentialForm;
    responder?: string;
    onReturnToManagement?: () => void;
}

export interface UnahonDashboardProps {
    session: Session | null;
}

export type Checklist = {
    [category: number]: { [key: number]: [a: boolean, b: boolean] };
};

export interface UnahonTableProps {
    isViewOnly: boolean;
    index: number; // or the appropriate type
    checklist: Checklist;
    handleChecklistChange: (rowNumber: number, column: number) => void;
    competency: number | string | null;
    goToConfidentialPage: () => void;
}

export interface UnahonModalProps {
    index: number;
    rowNumber: number;
    isOpen: boolean;
    competency: number | string | null;
    onOpenChange: () => void;
    onDone: () => void;
    onCancel: () => void;
}

export interface ConfidentialForm {
    client: string; // this now stores the Patient ID value
    userId: string;
    location: string;
    date: Date;
    affiliation: string;
    assessmentType: AssessmentType;
    availablePatientIds?: string[];
}

export interface UnahonConfidentialProps {
    confidentialForm: ConfidentialForm;
    handleConfidentialFormChange: (id: string, value: any) => void;
    isViewOnly: boolean;
    isReassessment: boolean;
    responder: string;
}

export interface Column {
    key: string;
    label: string;
}

export interface Row {
    number: number;
    description: string;
    span: number;
}

export interface UnahonGuideProps {
    page: number;
}

export interface FormRow {
    id: string;
    key: string;
    'client-id': string;
    location: string; // ✅ ADD THIS
    'responder-name': string;
    date: string;
    affiliation: string;
    'assessment-type': AssessmentType;
    confidentialForm: any;
    checklist: any;
}

export interface UnahonFormEntry {
    id: string;
    confidentialForm: ConfidentialForm;
    responder: string;
    checklist: Checklist;
}

export interface UnahonApiResponse {
    data: {
        [clientId: string]: UnahonFormEntry[];
    };
    count: number;
}

export type UnahonSummary = {
    redCount: number;
    yellowCount: number;
    greenCount: number;
    noneCount: number;
    initialAssessment: number;
    reassessment: number;
};
