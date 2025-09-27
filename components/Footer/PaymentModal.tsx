const PaymentModal = ({
    matricule,
    isOpen,
    onClose
} : {
    matricule: string;
    isOpen: boolean;
    onClose: (payment: boolean) => void;
}) => {
    return (
        <div>
            <h2>Payment Modal</h2>
        </div>
    );
};

export default PaymentModal;
