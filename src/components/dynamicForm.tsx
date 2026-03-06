import React, { useEffect, useMemo } from "react";
import {
    Input,
    Radio,
    Checkbox,
    Row,
    Col,
    Form,
    Upload,
} from "antd";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import type { DefaultOptionType } from "antd/es/select";
import AppButton from "./button";
import AppSelect from "./select";
import type { UploadFile, UploadProps } from "antd";
import { UploadOutlined, InboxOutlined } from "@ant-design/icons";

/* ================= TYPES ================= */

export type FieldType =
    | "text"
    | "number"
    | "email"
    | "password"
    | "textarea"
    | "select"
    | "radio"
    | "checkbox"
    | "upload"
    | "custom";

export type ModeType = 'multiple' | 'tags'
export type UploadVariant = "button" | "dragger";
interface ControlledComponentProps {
    value?: any;
    onChange?: (value: any) => void;
}

interface FormField {
    name: string;
    label?: string;
    type: FieldType;
    placeholder?: string;
    readOnly?: boolean;
    span?: number;
    options?: { label: string; value: any }[];
    selectedOptionsFromBackend?: { label: string; value: any }[];

    /** NEW — select controls */
    searchMode?: "local" | "remote";
    onRemoteSearch?: (value: string) => void;
    enableInfiniteScroll?: boolean;
    onLoadMore?: () => void;
    hasMore?: boolean;
    loading?: boolean,
    showSearch?: boolean;
    mode?: ModeType,

    /**
   * Upload controls
   *
   * - uploadVariant: "button" (default) renders a standard Upload + Button.
   *                  "dragger" renders the drag-and-drop Dragger variant.
   * - accept:        Mime-type / extension filter, e.g. "image/*" or ".pdf,.docx"
   * - maxCount:      Maximum number of files allowed (default: 1).
   * - multiple:      Allow selecting several files in the OS dialog.
   * - uploadText:    Label shown inside the Dragger area.
   * - uploadHint:    Sub-text shown inside the Dragger area.
   * - beforeUpload:  Custom validation hook; return false to prevent upload.
   *                  Defaults to a no-op that prevents automatic upload.
   * - onUploadChange: Fired on every file-list change with the full UploadProps
   *                   onChange payload — useful for side-effects (previews, etc.).
   *
   * The RHF field value is always the Ant Design `UploadFile[]` array so callers
   * can read `fileList[0].originFileObj` for the raw `File` object.
   */
    uploadVariant?: UploadVariant;
    accept?: string;
    maxCount?: number;
    multiple?: boolean;
    uploadText?: string;
    uploadHint?: string;
    beforeUpload?: UploadProps["beforeUpload"];
    onUploadChange?: UploadProps["onChange"];


    customComponent?: React.ReactElement<ControlledComponentProps>;
    defaultValue?: any;
    className?: string;
    inputClassName?: string;
    disabled?: boolean
}

interface DynamicFormProps {
    fields: FormField[];
    validationSchema?: Record<string, any>;
    type?: "create" | "edit";
    editData?: Record<string, any>;
    loading?: boolean;
    submitText?: string;
    onSubmit: (data: any) => Promise<boolean> | boolean;
    submitBtnDisable?: boolean
}

/* ================= COMPONENT ================= */

const DynamicForm: React.FC<DynamicFormProps> = ({
    fields,
    validationSchema,
    type = "create",
    editData,
    loading,
    submitText = "Submit",
    onSubmit,
    submitBtnDisable = false
}) => {
    /* ---------- validation ---------- */

    const schema = useMemo(
        () => Yup.object().shape(validationSchema || {}),
        [validationSchema]
    );

    const defaultValues = useMemo(() => {
        const values: Record<string, any> = {};
        fields.forEach((f) => {
            values[f.name] = f.defaultValue ?? undefined;
        });
        return values;
    }, [fields]);

    const {
        control,
        handleSubmit,
        reset,
    } = useForm({
        resolver: yupResolver(schema),
        mode: "onChange",
        defaultValues,
    });

    /* ---------- populate edit ---------- */

    useEffect(() => {
        if (type === "edit" && editData) {
            reset(editData);
        }
    }, [type, editData, reset]);

    /* ---------- submit ---------- */

    const submitHandler = async (formData: any) => {
        const resp = await onSubmit(formData);
        if (resp && type === "create") {
            reset(defaultValues);
        }
        return resp;
    };

    /* ================= FIELD RENDERER ================= */

    const renderField = (field: FormField) => {
        const span = field.span ?? 24;

        return (
            <Col xs={24} sm={24} md={span} key={field.name}>
                <Controller
                    name={field.name}
                    control={control}
                    render={({ field: rhfField, fieldState }) => {
                        const status = fieldState.error ? ("error" as const) : undefined;
                        // const FIELD_SIZE: "large" | "middle" | "small" = "large";
                        const commonProps = {
                            placeholder: field.placeholder,
                            disabled: field.readOnly,
                            status,
                            size: "large" as const,
                            className: field.className,
                        };
                        switch (field.type) {
                            /* ---------- TEXT ---------- */
                            case "text":
                            case "email":
                                return (
                                    <Form.Item
                                        label={field.label}
                                        validateStatus={fieldState.error ? "error" : ""}
                                        help={fieldState.error?.message}
                                    >
                                        <Input {...rhfField} {...commonProps} className={`w-full ${field.inputClassName || ""}`} />
                                    </Form.Item>
                                );

                            case "number":
                                return (
                                    <Form.Item
                                        label={field.label}
                                        validateStatus={fieldState.error ? "error" : ""}
                                        help={fieldState.error?.message}
                                    >
                                        <Input
                                            type="number"
                                            {...rhfField}
                                            {...commonProps}
                                            className={`w-full ${field.inputClassName || ""}`}
                                        />
                                    </Form.Item>
                                );

                            /* ---------- PASSWORD ---------- */
                            case "password":
                                return (
                                    <Form.Item
                                        label={field.label}
                                        validateStatus={fieldState.error ? "error" : ""}
                                        help={fieldState.error?.message}
                                    >
                                        <Input.Password {...rhfField} {...commonProps} className={`w-full ${field.inputClassName || ""}`} />
                                    </Form.Item>
                                );

                            /* ---------- TEXTAREA ---------- */
                            case "textarea":
                                return (
                                    <Form.Item
                                        label={field.label}
                                        validateStatus={fieldState.error ? "error" : ""}
                                        help={fieldState.error?.message}
                                    >
                                        <Input.TextArea rows={4} {...rhfField} {...commonProps} className={`w-full ${field.inputClassName || ""}`} />
                                    </Form.Item>
                                );

                            /* ---------- SELECT ---------- */
                            case "select":
                                return (
                                    <Form.Item
                                        label={field.label}
                                        validateStatus={fieldState.error ? "error" : ""}
                                        help={fieldState.error?.message}
                                        style={{ width: "100%" }}
                                    >
                                        <AppSelect
                                            options={field.options as DefaultOptionType[]}
                                            hydratedOptions={field?.selectedOptionsFromBackend as DefaultOptionType[]}
                                            value={rhfField.value}
                                            onChange={(val) => rhfField.onChange(val)}
                                            onBlur={rhfField.onBlur}
                                            disabled={field.readOnly}
                                            placeholder={field.placeholder}
                                            size="large"
                                            allowClear
                                            className={`w-full ${field.inputClassName || ""}`}
                                            searchMode={field.searchMode}
                                            onRemoteSearch={field.onRemoteSearch}
                                            enableInfiniteScroll={field.enableInfiniteScroll}
                                            onLoadMore={field.onLoadMore}
                                            hasMore={field.hasMore}
                                            showSearch={field?.showSearch}
                                            mode={field?.mode}
                                        />
                                    </Form.Item>
                                );

                            /* ---------- RADIO ---------- */
                            case "radio":
                                return (
                                    <Form.Item
                                        label={field.label}
                                        validateStatus={fieldState.error ? "error" : ""}
                                        help={fieldState.error?.message}
                                    >
                                        <Radio.Group
                                            {...rhfField}
                                            options={field.options}
                                            className={`w-full ${field.inputClassName || ""}`}
                                        />
                                    </Form.Item>
                                );

                            /* ---------- CHECKBOX ---------- */
                            case "checkbox":
                                return (
                                    <Form.Item
                                        validateStatus={fieldState.error ? "error" : ""}
                                        help={fieldState.error?.message}
                                    >
                                        <Checkbox
                                            checked={!!rhfField.value}
                                            onChange={(e) => rhfField.onChange(e.target.checked)}
                                            disabled={field.readOnly}
                                            className={`w-full ${field.inputClassName || ""}`}
                                        >
                                            {field.label}
                                        </Checkbox>
                                    </Form.Item>
                                );

                            /* ---------- UPLOAD ---------- */
                            case "upload": {
                                /**
                                 * Shared Upload props wired to React Hook Form.
                                 *
                                 * `beforeUpload` defaults to `() => false` which prevents Ant Design
                                 * from auto-posting the file to a non-existent endpoint while still
                                 * adding it to the fileList so we can read it later.
                                 *
                                 * The RHF value is kept as an `UploadFile[]` array. Callers can
                                 * access the raw File via `fileList[0].originFileObj`.
                                 */
                                const fileList: UploadFile[] = Array.isArray(rhfField.value)
                                    ? rhfField.value
                                    : rhfField.value
                                        ? [rhfField.value]
                                        : [];

                                const sharedUploadProps: UploadProps = {
                                    fileList,
                                    accept: field.accept,
                                    maxCount: field.maxCount ?? 1,
                                    multiple: field.multiple ?? false,
                                    disabled: field.readOnly ?? field.disabled,
                                    beforeUpload: field.beforeUpload ?? (() => false), // prevent auto-upload
                                    onChange: (info) => {
                                        // Keep only the latest slice respecting maxCount
                                        const max = field.maxCount ?? 1;
                                        const next = info.fileList.slice(-max);
                                        rhfField.onChange(next);
                                        field.onUploadChange?.(info);
                                    },
                                    onRemove: (file) => {
                                        const next = fileList.filter((f) => f.uid !== file.uid);
                                        rhfField.onChange(next);
                                    },
                                };

                                if (field.uploadVariant === "dragger") {
                                    return (
                                        <Form.Item
                                            label={field.label}
                                            validateStatus={fieldState.error ? "error" : ""}
                                            help={fieldState.error?.message}
                                        >
                                            <Upload.Dragger
                                                {...sharedUploadProps}
                                                className={field.inputClassName}
                                            >
                                                <p className="ant-upload-drag-icon">
                                                    <InboxOutlined />
                                                </p>
                                                <p className="ant-upload-text">
                                                    {field.uploadText ?? "Click or drag file to this area to upload"}
                                                </p>
                                                {field.uploadHint && (
                                                    <p className="ant-upload-hint">{field.uploadHint}</p>
                                                )}
                                            </Upload.Dragger>
                                        </Form.Item>
                                    );
                                }

                                // Default: button variant
                                return (
                                    <Form.Item
                                        label={field.label}
                                        validateStatus={fieldState.error ? "error" : ""}
                                        help={fieldState.error?.message}
                                    >
                                        <Upload
                                            {...sharedUploadProps}
                                            className={field.inputClassName}
                                        >
                                            <AppButton
                                                icon={<UploadOutlined />}
                                                size="large"
                                                disabled={field.readOnly ?? field.disabled}
                                            >
                                                {field.uploadText ?? "Click to Upload"}
                                            </AppButton>
                                        </Upload>
                                    </Form.Item>
                                );
                            }


                            /* ---------- CUSTOM ---------- */
                            case "custom":
                                return (
                                    <Form.Item
                                        label={field.label}
                                        validateStatus={fieldState.error ? "error" : ""}
                                        help={fieldState.error?.message}
                                    >
                                        {field.customComponent
                                            ? React.cloneElement(field.customComponent, {
                                                value: rhfField.value,
                                                onChange: rhfField.onChange,
                                            })
                                            : null}
                                    </Form.Item>
                                );

                            default:
                                return <span />;
                        }
                    }}
                />
            </Col>
        );
    };

    /* ================= RENDER ================= */

    return (
        <Form layout="vertical" component={false}>

            <form onSubmit={handleSubmit(submitHandler)}>
                <Row gutter={[16, 8]}>
                    {fields.map(renderField)}
                </Row>

                <div className="mt-4 flex justify-end">
                    <AppButton
                        htmlType="submit"
                        loading={loading}
                        disabled={submitBtnDisable}
                    >
                        {submitText}
                    </AppButton>
                </div>
            </form>
        </Form>
    );
};

export default DynamicForm;