import { Checkbox, Col, InputNumber, Row } from "antd";
import { useEffect, useMemo, useState } from "react";
import AppSelect from "../select";
import DebounceSearchBar from "../debounceSearch";
import { IoIosSearch } from "react-icons/io";
import type { DefaultOptionType } from "antd/es/select";
import type { FilterBarProps, FilterValue, RenderFieldProps } from "./types/types";
import { debounce } from "lodash";
import AppButton from "../button";
import { DatePicker } from 'antd';
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import './styles/styles.css'
import { isDateRange, normalize, validate } from "./util/helpers";

const { RangePicker } = DatePicker;

const Filterbar = <T extends object>({
    schema,
    onChange,
}: FilterBarProps<T>) => {
    const [filtersValues, setFiltersValues] = useState<T>(() => {
        return schema.reduce((acc, f) => {
            const key = f.name as keyof T;

            if (f.type === "dateRange") {
                acc[key] = (f.value ?? [dayjs(), dayjs()]) as T[typeof key];
            } else if (f.type === "range") {
                acc[key] = null as T[typeof key];
            } else {
                acc[key] = (f.value) as T[typeof key];
            }

            return acc;
        }, {} as T);
    });
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [searchResetKey, setSearchResetKey] = useState(0);

    const debouncedChange = useMemo(
        () => debounce(onChange, 400),
        [onChange]
    );

    useEffect(() => {
        return () => debouncedChange.cancel();
    }, [debouncedChange]);

    const emitChange = (updated: T, shouldDebounce: boolean) => {
        if (shouldDebounce) {
            debouncedChange(updated);
        } else {
            onChange(updated);
        }
    };

    const handleChange = (
        name: keyof T,
        value: FilterValue,
        type: string,
        rangeType?: "min" | "max"
    ) => {
        if (type === "range") return handleRange(name, value, rangeType);
        if (type === "dateRange") {
            if (isDateRange(value)) {
                return handleDateRange(name, value);
            }
            return;
        }
        return handlePrimitive(name, value);
    };

    const handleDateRange = (name: keyof T, value: [Dayjs | null, Dayjs | null]) => {
        setFiltersValues(prev => {
            const current = value as [Dayjs | null, Dayjs | null];

            const updated: T = {
                ...prev,
                [name]: current ?? [dayjs(), dayjs()]
            };

            emitChange(updated, false);
            return updated;
        });
    };

    const handleRange = (
        name: keyof T,
        value: FilterValue,
        rangeType?: "min" | "max"
    ) => {
        setFiltersValues(prev => {
            const current = (prev[name] ?? null) as [number, number];

            const range: [number, number] = Array.isArray(current)
                ? [...current]
                : [0, 0];

            if (rangeType === "min") range[0] = Number(value);
            if (rangeType === "max") range[1] = Number(value);

            const updated = { ...prev, [name]: range } as T;

            const newErrors = validate(updated as Record<string, unknown>);
            setErrors(newErrors);

            emitChange(updated, true);
            return updated;
        });
    };

    const handlePrimitive = (name: keyof T, value: FilterValue) => {
        setFiltersValues(prev => {
            const updated = { ...prev, [name]: value } as T;
            emitChange(updated, true);
            return updated;
        });
    };

    const resetFilter = () => {
        const updated = schema.reduce((acc, f) => {
            const key = f.name as keyof T;

            if (f.type === "range") {
                acc[key] = null as T[typeof key];
            }

            else if (f.type === "dateRange") {
                acc[key] = [dayjs(), dayjs()] as T[typeof key];
            }

            else {
                acc[key] = (f.default ?? null) as T[typeof key];
            }

            return acc;
        }, {} as T);

        setFiltersValues(updated);
        setErrors({});
        setSearchResetKey(prev => prev + 1);
        onChange(updated);
    };

    const showReset = schema.some((field) => {
        const key = field.name as keyof T;

        const current = normalize(filtersValues[key]);
        const defaultValue = normalize(field.default);

        // stringify to make sure [0,0] !== [0,0] doesnt cause issues
        return JSON.stringify(current) !== JSON.stringify(defaultValue);
    });

    const renderField = ({
        type,
        name,
        value,
        options,
        minValue,
        maxValue,
        minRangeLimObj,
        maxRangeLimObj,
        dateValue,
    }: RenderFieldProps<T>) => {
        switch (type) {
            case "range":
                return (
                    <div className="flex items-center gap-2 border border-[#d3d3d3] p-0.75 rounded-lg bg-[#f9f9f9]">
                        <InputNumber
                            placeholder="Minimum"
                            value={minValue}
                            onChange={(value) =>
                                handleChange(name, value as FilterValue, type, "min")
                            }
                            className="flex-1 min-w-0 h-9"
                            min={minRangeLimObj?.min}
                            max={minRangeLimObj?.max}
                            controls={false}
                        />
                        <span className="text-gray-300 text-sm">—</span>
                        <InputNumber
                            placeholder="Maximum"
                            value={maxValue}
                            onChange={(value) =>
                                handleChange(name, value as FilterValue, type, "max")
                            }
                            className="flex-1 min-w-0 h-9"
                            min={maxRangeLimObj?.min}
                            max={maxRangeLimObj?.max}
                            controls={false}
                        />
                    </div>
                );

            case "select":
                return (
                    <AppSelect
                        value={value as string | undefined}
                        placeholder="Select Item Status"
                        options={options as DefaultOptionType[]}
                        className="w-full h-11"
                        onChange={(val: string) =>
                            handleChange(name, val, type)
                        }
                    />
                );

            case "search":
                return (
                    <DebounceSearchBar
                        prefix={<IoIosSearch size={20} color="gray" />}
                        setSearchDebouncedValue={(val) =>
                            handleChange(name, val as FilterValue, type)
                        }
                        resetKey={searchResetKey}
                        className="h-11"
                    />
                );

            case "dateRange":
                return (
                    <RangePicker
                        value={dateValue}
                        onChange={(dates) =>
                            handleChange(name, dates as FilterValue, type)
                        }
                        format="YYYY-MM-DD"
                        allowClear
                        className="w-full h-11"
                    />
                );

            case "checkbox":
                return (
                    <div className="custom-checkbox w-full h-11 flex items-center justify-center border border-[#d3d3d3] p-0.75 rounded-lg bg-[#f9f9f9]">
                        <Checkbox
                            checked={Boolean(value)}
                            onChange={(e) =>
                                handleChange(name, e.target.checked, type)
                            }
                        />
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <Row gutter={[12, 12]}>
            {schema.map((field) => {
                const { name, label, colspan, layout, type, options, limits } = field;
                const value = filtersValues[name as keyof T];

                let minValue, maxValue, minRangeLimObj, maxRangeLimObj;
                let dateValue: [Dayjs | null, Dayjs | null] | null = null;

                if (type === "range") {
                    minValue =
                        Array.isArray(value) && typeof value[0] === "number"
                            ? value[0]
                            : undefined;
                    maxValue =
                        Array.isArray(value) && typeof value[1] === "number"
                            ? value[1]
                            : undefined;

                    if (limits?.length) {
                        minRangeLimObj = limits.find((o) => o.name === "min");
                        maxRangeLimObj = limits.find((o) => o.name === "max");
                    }
                }

                if (type === "dateRange") {
                    dateValue = value as [Dayjs | null, Dayjs | null];
                }

                return (
                    <Col
                        xs={{ span: colspan?.xs }}
                        sm={{ span: colspan?.sm }}
                        md={{ span: colspan?.md }}
                        lg={{ span: colspan?.lg }}
                        key={name as string}
                        className={
                            layout === "horizontal"
                                ? "flex items-center gap-1.5"
                                : ""
                        }
                    >
                        {label && (
                            <label className="text-xs text-gray-500 font-medium">
                                {label}
                            </label>
                        )}

                        {renderField({
                            type,
                            name,
                            value,
                            options,
                            limits,
                            minValue,
                            maxValue,
                            minRangeLimObj,
                            maxRangeLimObj,
                            dateValue,
                        })}

                        {errors?.[name as string] && (
                            <div className="text-red-500 text-xs">
                                {errors[name as string]}
                            </div>
                        )}
                    </Col>
                );
            })}

            <Col
                xs={{ span: 24 }}
                sm={{ span: 3 }}
                lg={{ span: 2 }}
                className={`
                sm:pt-5
                transition-all duration-300 ease-in-out
                overflow-hidden
                ${showReset
                        ? "opacity-100 max-h-20 scale-100"
                        : "opacity-0 max-h-0 scale-95 pointer-events-none"
                    }
            `}
            >
                <AppButton
                    onClick={resetFilter}
                    title="Reset"
                    className="w-full sm:h-full!"
                >
                    Reset
                </AppButton>
            </Col>
        </Row>
    );
};

export default Filterbar;