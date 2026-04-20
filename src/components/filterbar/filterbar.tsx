import { Col, InputNumber, Row } from "antd";
import React, { useEffect, useMemo, useRef, useState } from "react";
import AppSelect from "../select";
import DebounceSearchBar from "../debounceSearch";
import { IoIosSearch } from "react-icons/io";
import type { DefaultOptionType } from "antd/es/select";
import type { FilterBarProps } from "./types";
import { debounce } from "lodash";
import AppButton from "../button";

const Filterbar: React.FC<FilterBarProps> = ({ schema, onChange }) => {
    const [filters, setFilters] = useState<Record<string, any>>(() => {
        const initial: Record<string, any> = {};

        schema.forEach((f) => {
            if (f.type === "range") {
                initial[f.name] = null
            } else {
                initial[f.name] = f.value ?? "";
            }
        });

        return initial;
    });
    const [searchResetKey, setSearchResetKey] = useState(0);


    const debouncedRef = useRef(debounce(onChange, 400));

    useEffect(() => {
        debouncedRef.current = debounce(onChange, 400);

        return () => {
            debouncedRef.current.cancel();
        };
    }, [onChange]);

    const errors = useMemo(() => {
        const errs: Record<string, string> = {};

        const min = Number(filters.min);
        const max = Number(filters.max);

        if (filters.min && isNaN(min)) {
            errs.min = "Min must be a number";
        }

        if (filters.max && isNaN(max)) {
            errs.max = "Max must be a number";
        }

        if (filters.min && filters.max && min > max) {
            errs.max = "Max must be greater than or equal to Min";
        }

        return errs;
    }, [filters]);

    const handleChange = (
        name: string,
        value: any,
        debounce = false,
        rangeType?: "min" | "max"
    ) => {
        setFilters((prev) => {
            const updated = { ...prev };

            if (rangeType) {
                const current = Array.isArray(prev[name]) ? [...prev[name]] : [0, 0];

                if (rangeType === "min") current[0] = Number(value);
                if (rangeType === "max") current[1] = Number(value);

                updated[name] = current;
            } else {
                updated[name] = value;
            }

            if (debounce) {
                debouncedRef.current(updated);
            } else {
                onChange(updated);
            }

            return updated;
        });
    };

    const resetFilter = () => {
        const updated: Record<string, any> = {};

        schema.forEach((f) => {
            if (f.type === "range") {
                updated[f.name] = null
            } else {
                updated[f.name] = f.default ?? "";
            }
        });

        setFilters(updated);
        setSearchResetKey((prev) => prev + 1);
        onChange(updated);
    };

    const showReset = Object.keys(filters).some((key) => {
        const current = filters[key];
        const defaultValue = schema.find(f => f.name === key)?.default;

        return current !== defaultValue;
    });
    console.log(filters, 'filter')
    return (
        <Row gutter={[12, 12]}>
            {schema.map((field) => {
                const { name, label, colspan, layout, type, options, } = field || {};

                return (
                    <Col xs={{ span: colspan?.xs }} sm={{ span: colspan?.sm }} md={{ span: colspan?.md }} lg={{ span: colspan?.lg }}
                        key={name}
                        className={layout === "horizontal" ? "flex items-center gap-1.5" : ""}>
                        {label && (
                            <label className="text-xs text-gray-500 font-medium">{label}</label>
                        )}

                        {type === 'range' ? (
                            <React.Fragment>
                                <div className="flex items-center gap-2 border border-[#d3d3d3] p-[3px] rounded-lg bg-[#f9f9f9]">
                                    <InputNumber
                                        placeholder="Minimum"
                                        value={filters[name]?.[0] ?? undefined}
                                        onChange={value => handleChange(name, value, true, 'min')}
                                        className="flex-1 min-w-0 h-9"
                                        min={0}
                                        max={999999}
                                        controls={false}
                                    />
                                    <span className="text-gray-300 text-sm">—</span>
                                    <InputNumber
                                        placeholder="Maximum"
                                        value={filters[name]?.[1] ?? undefined}
                                        onChange={value => handleChange(name, value, true, 'max')}
                                        className="flex-1 min-w-0 h-9"
                                        min={0}
                                        max={999999}
                                        controls={false}
                                    />
                                </div>
                            </React.Fragment>
                        ) : type === 'select' ? (
                            <AppSelect
                                value={filters[name]}
                                placeholder="Select Item Status"
                                options={options as DefaultOptionType[]}
                                className="w-full h-11"
                                onChange={(value: string) => handleChange(name, value)}
                            />
                        ) : type === 'search' ? (
                            <DebounceSearchBar
                                prefix={<IoIosSearch size={20} color="gray" />}
                                setSearchDebouncedValue={(value: string) => handleChange(name, value)}
                                resetKey={searchResetKey}
                                className="h-11"
                            />
                        ) : null}

                        {errors[name] && (
                            <div className="text-red-500 text-xs">{errors[name]}</div>
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
                    className="w-full sm:!h-full"
                >
                    Reset
                </AppButton>
            </Col>
        </Row>
    );
};

export default Filterbar;