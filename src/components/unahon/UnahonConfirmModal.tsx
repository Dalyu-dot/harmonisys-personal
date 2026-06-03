import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from '@heroui/react';

interface UnahonConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const UnahonConfirmModal: React.FC<UnahonConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
}) => (
    <Modal
        isOpen={isOpen}
        onClose={onClose}
        backdrop="opaque"
        classNames={{
            backdrop: 'bg-black/55 backdrop-blur-sm',
            base: 'border border-[#7B122F]/20 bg-white/95 backdrop-blur-md shadow-2xl',
            header: 'border-none',
            body: 'py-6',
            footer: 'border-none',
            closeButton:
                'text-slate-400 hover:text-[#7B122F] hover:bg-[#7B122F]/10',
        }}
    >
        <ModalContent>
            <ModalHeader className="text-2xl font-black text-[#7B122F]">
                Confirm Submission
            </ModalHeader>

            <ModalBody>
                <p className="text-slate-700 text-base leading-relaxed">
                    Are you sure you want to submit this assessment?
                </p>
            </ModalBody>

            <ModalFooter className="gap-3">
                <Button
                    variant="light"
                    onPress={onClose}
                    className="font-semibold text-[#7B122F] hover:bg-[#7B122F]/10"
                >
                    Cancel
                </Button>

                <Button
                    onPress={onConfirm}
                    className="font-semibold bg-gradient-to-r from-[#7B122F] to-[#A3153D] text-white shadow-lg hover:shadow-xl hover:from-[#6A0F28] hover:to-[#8E1A3B] transition-all duration-300"
                >
                    Submit
                </Button>
            </ModalFooter>
        </ModalContent>
    </Modal>
);

export default UnahonConfirmModal;
