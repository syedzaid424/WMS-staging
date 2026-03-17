import AppModal from '../../../../components/modal'


interface AddStockLocationModalInterface {
    newLocationModalState: boolean;
    setNewLocationModalState: React.Dispatch<React.SetStateAction<boolean>>;
    setRefreshStockLocationListing?: React.Dispatch<React.SetStateAction<number>>
}


const AddStockLocationModal = ({ newLocationModalState, setNewLocationModalState }: AddStockLocationModalInterface) => {
    return (
        <AppModal
            open={newLocationModalState}
            onCancel={() => setNewLocationModalState(false)}
            title="Add Stock Location"
            width={600}
            destroyOnHidden
            // afterOpenChange={afterOpenChange}
        >
            <div className='py-2'>
                {/* <DynamicForm
                    type="create"
                    submitText="Add Stock Location"
                    loading={loading}
                    fields={formFields}
                    validationSchema={adjustmentStockShema}
                    onSubmit={handleAdjustment}
                /> */}
            </div>
        </AppModal>
    )
}

export default AddStockLocationModal
