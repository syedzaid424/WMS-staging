import type { FieldType, ModeType, UploadVariant } from '../../../../components/dynamicForm'
import { message, Upload } from "antd";
import type { SelectInterface } from '../../../../utils/types';
import { useEffect, useState } from 'react';
import type { ItemCategoryRow, ItemTagRow } from '../../../../types/main/item';


interface ItemCreationFormHook {
    availableItemCategories: ItemCategoryRow[],
    itemCategoryLoading: boolean,

    availableItemTags: ItemTagRow[],
    itemTagLoading: boolean,
}

const useItemCreationFormHook = ({

    availableItemCategories,
    itemCategoryLoading,

    availableItemTags,
    itemTagLoading,
}: ItemCreationFormHook) => {

    const [availableItemCategoryListing, setAvailableItemCategoryListing] = useState<SelectInterface[]>([]);
    const [availableTagListing, setAvailableTagListing] = useState<SelectInterface[]>([]);

    // to set item category listing.
    useEffect(() => {
        if (availableItemCategories && availableItemCategories?.length > 0) {
            const items = availableItemCategories.map((itemCategory) => ({
                label: itemCategory.name,
                value: itemCategory.id
            }));
            setAvailableItemCategoryListing(items);
        }
    }, [availableItemCategories]);

    // to set item tag listing.
    useEffect(() => {
        if (availableItemTags && availableItemTags?.length > 0) {
            const items = availableItemTags.map((itemTag) => ({
                label: itemTag.name,
                value: itemTag.id
            }));
            setAvailableTagListing(items);
        }
    }, [availableItemCategories]);


    console.log(availableTagListing)

    return [
        {
            name: "sku",
            label: "SKU",
            type: "text" as FieldType,
            placeholder: "e.g. SKU-1002",
            span: 8,
        },
        {
            name: "code",
            label: "Code",
            type: "text" as FieldType,
            placeholder: "e.g. COD-1003",
            span: 8,
        },
        {
            name: "name",
            label: "Product Name",
            type: "text" as FieldType,
            placeholder: "e.g. Double sofa with cushions",
            span: 8,
        },
        {
            name: "categoryId",
            label: "Category",
            type: "select" as FieldType,
            placeholder: "Select a category",
            options: availableItemCategoryListing,
            inputClassName: "h-10",
            showSearch: false,
            span: 8,
            enableInfiniteScroll: false,
            loading: itemCategoryLoading,
        },
        {
            name: "tagIds",
            label: "Tags",
            type: "select" as FieldType,
            placeholder: "Select tags",
            options: availableTagListing,
            mode: "multiple" as ModeType,       // multi-select
            showSearch: false,
            span: 8,
            enableInfiniteScroll: false,
            loading: itemTagLoading,
        },
        {
            name: "weight",
            label: "Weight (kg)",
            type: "number" as FieldType,
            placeholder: "e.g. 1.5",
            span: 8,
        },
        {
            name: "height",
            label: "Height (m)",
            type: "number" as FieldType,
            placeholder: "e.g. 2.8",
            span: 8,
        },
        {
            name: "width",
            label: "Width (m)",
            type: "number" as FieldType,
            placeholder: "e.g. 2.3",
            span: 8,
        },
        {
            name: "length",
            label: "Length (m)",
            type: "number" as FieldType,
            placeholder: "e.g. 2.2",
            span: 8,
        },
        {
            name: "description",
            label: "Description",
            type: "textarea" as FieldType,
            placeholder: "Brief product description...",
            span: 24,
        },
        {
            name: "image",
            label: "Product Image",
            type: "upload" as FieldType,
            uploadVariant: "dragger" as UploadVariant,
            accept: "image/*",
            maxCount: 1,
            uploadText: "Click or drag product image here",
            uploadHint: "Supports JPG, PNG, WEBP — max 5 MB",
            span: 8,
            beforeUpload: (file: any) => {
                const isImage = file.type.startsWith("image/");
                const isUnder5MB = file.size / 1024 / 1024 < 1;
                if (!isImage) { message.error("Only image files are allowed."); return Upload.LIST_IGNORE; }
                if (!isUnder5MB) { message.error("Image must be smaller than 5 MB."); return Upload.LIST_IGNORE; }
                return false; // prevent auto-upload, let RHF hold the file
            },
        },
    ];
}

export default useItemCreationFormHook
