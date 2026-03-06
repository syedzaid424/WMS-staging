import { Select } from "antd";
import type { SelectProps, DefaultOptionType } from "antd/es/select";
import { useMemo } from "react";

type SearchMode = "local" | "remote";

interface AppSelectProps<
    ValueType = string,
    OptionType extends DefaultOptionType = DefaultOptionType
> extends Omit<SelectProps<ValueType, OptionType>, ""> {
    searchMode?: SearchMode;
    onRemoteSearch?: (value: string) => void;

    /** infinite scroll props */
    enableInfiniteScroll?: boolean;
    onLoadMore?: () => void;
    hasMore?: boolean;
    setDropdownRef?: (el: HTMLElement | null) => void;
    /** selected items from backend */
    hydratedOptions?: OptionType[];
}

function AppSelect<
    ValueType = string,
    OptionType extends DefaultOptionType = DefaultOptionType
>({
    searchMode = "local",
    onRemoteSearch,

    enableInfiniteScroll,
    onLoadMore,
    hasMore,
    setDropdownRef,
    options = [],
    hydratedOptions,
    loading,
    placeholder,
    ...rest
}: AppSelectProps<ValueType, OptionType>) {

    console.log(hydratedOptions)
    console.log(options)

    /** merge + dedupe */
    // ✅ Memoized — only recalculates when options or hydratedOptions actually change
    const mergedOptions = useMemo(() => {
        if (!hydratedOptions?.length) return options as OptionType[];

        const map = new Map<any, OptionType>();

        hydratedOptions.forEach(opt => {
            if (opt?.value != null) map.set(opt.value, opt);
        });

        (options as OptionType[]).forEach(opt => {
            if (opt?.value != null && !map.has(opt.value)) {
                map.set(opt.value, opt);
            }
        });

        return Array.from(map.values());
    }, [options, hydratedOptions]); // ✅ stable — arrays compared by reference

    /** dropdown scroll handler */
    const handlePopupScroll = (e: React.UIEvent<HTMLDivElement>) => {
        if (!enableInfiniteScroll || !hasMore || loading) return;

        const target = e.target as HTMLDivElement;
        setDropdownRef?.(target);

        const isBottom =
            target.scrollTop + target.offsetHeight >= target.scrollHeight - 20;

        if (isBottom) {
            onLoadMore?.();
        }
    };

    return (
        <Select<ValueType, OptionType>
            options={mergedOptions}
            loading={loading}
            placeholder={placeholder}
            style={{ width: "100%" }}
            onPopupScroll={handlePopupScroll}
            showSearch={{
                filterOption:
                    searchMode === "local"
                        ? (input, option) =>
                            (option?.label ?? "")
                                .toString()
                                .toLowerCase()
                                .includes(input.toLowerCase())
                        : false,
                onSearch:
                    searchMode === "remote"
                        ? (value) => {
                            onRemoteSearch?.(value);
                        }
                        : undefined,
            }}
            {...rest}
        />
    );
}

export default AppSelect;