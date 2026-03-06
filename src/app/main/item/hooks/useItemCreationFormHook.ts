import type { FieldType, ModeType, UploadVariant } from '../../../../components/dynamicForm'
import { message, Upload } from "antd";
import type { SelectInterface } from '../../../../utils/types';
import { useMemo } from 'react';  // ✅ removed useEffect, useState
import type { ItemCategoryRow, ItemTagRow } from '../../../../types/main/item';

interface ItemCreationFormHook {
    availableItemCategories: ItemCategoryRow[],
    itemCategoryLoading: boolean,
    availableItemTags: ItemTagRow[],
    itemTagLoading: boolean,
    activeType?: string
}

// ✅ Stable — defined once outside the hook, never recreated
const beforeUpload = (file: any) => {
    const isImage = file.type.startsWith("image/");
    const isUnder5MB = file.size / 1024 / 1024 < 1;
    if (!isImage) { message.error("Only image files are allowed."); return Upload.LIST_IGNORE; }
    if (!isUnder5MB) { message.error("Image must be smaller than 5 MB."); return Upload.LIST_IGNORE; }
    return false;
};

const useItemCreationFormHook = ({
    availableItemCategories,
    itemCategoryLoading,
    availableItemTags,
    itemTagLoading,
    activeType = "create"
}: ItemCreationFormHook) => {

    // ✅ Bug 1 fixed: replaced useState + useEffect with useMemo
    // useState + useEffect caused an extra render cycle:
    // props arrive → render with [] → useEffect fires → setState → re-render with data → repeat
    const availableItemCategoryListing = useMemo<SelectInterface[]>(() =>
        availableItemCategories?.map((itemCategory) => ({
            label: itemCategory.name,
            value: itemCategory.id
        })) ?? [],
        [availableItemCategories]
    );

    const availableTagListing = useMemo<SelectInterface[]>(() =>
        availableItemTags?.map((itemTag) => ({
            label: itemTag.name,
            value: itemTag.id
        })) ?? [],
        // ✅ Bug 2 fixed: was depending on availableItemCategories instead of availableItemTags!
        [availableItemTags]
    );

    // ✅ Bug 3 fixed: memoize the returned fields array so it's not
    // recreated on every render — this was causing AppSelect to re-render
    // on every parent render even when nothing changed
    const createFields = useMemo(() => [
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
            mode: "multiple" as ModeType,
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
            beforeUpload,
        },
    ], [availableItemCategoryListing, availableTagListing, itemCategoryLoading, itemTagLoading]);

    const editFields = useMemo(() => [
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
            beforeUpload,
        },
    ], [availableItemCategoryListing, itemCategoryLoading]);

    return activeType === "create" ? createFields : editFields;
}

export default useItemCreationFormHook;