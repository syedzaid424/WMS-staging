import { Select } from "antd";
import type { SelectProps, DefaultOptionType } from "antd/es/select";
import { useMemo, useRef } from "react";
import Loader from "./loader";

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
    hydratedOptions?: OptionType[];     // seed hydrated options.
    runtimeHydratedOptions?: OptionType[];  // run time options based on select, deselect - need to preseve it due to pagination and searching combinataion.
    onSelectOption?: (option: any, mode?: string) => void;
    onDeselectOption?: (value: any) => void;
    onClearAll?: () => void;
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
    options,
    hydratedOptions,
    runtimeHydratedOptions,
    loading,
    placeholder,
    showSearch,
    onSelectOption,
    onDeselectOption,
    onClearAll,
    onDropdownVisibleChange,
    ...rest
}: AppSelectProps<ValueType, OptionType>) {

    // Tracking open state
    const isDropdownOpenRef = useRef(false);

    // Memoized — only recalculates when options or hydratedOptions or runtimeHydratedOptions actually change
    const mergedOptions = useMemo(() => {
        if (!options?.length && !hydratedOptions?.length && !runtimeHydratedOptions?.length) return [];

        const map = new Map<any, OptionType>();

        // Seed manual hydrated first (pre-existing selections)
        hydratedOptions?.forEach(opt => {
            if (opt?.value != null) map.set(opt.value, opt);
        });

        // Then runtime hydrated (session selections) — overwrites if same value
        // runtime version may have fresher label data
        runtimeHydratedOptions?.forEach(opt => {
            if (opt?.value != null) map.set(opt.value, opt);
        });

        // Then paginated options
        (options ?? []).forEach(opt => {
            if (opt?.value != null && !map.has(opt.value)) {
                map.set(opt.value, opt);
            }
        });

        return Array.from(map.values());
    }, [options, hydratedOptions, runtimeHydratedOptions]);

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

    // showSearch prop from parent is used only to enable/disable — 
    // the actual filter/search logic is always controlled here
    const showSearchConfig = useMemo(() => {
        // If neither showSearch nor remote mode — disable entirely
        if (!showSearch && searchMode !== "remote") return false;

        if (searchMode === "remote") {
            return {
                // filterOption false for remote — server handles filtering
                filterOption: false,
                onSearch: (value: string) => {
                    if (!value && !isDropdownOpenRef.current) return;
                    onRemoteSearch?.(value);
                },
            };
        }

        // Local search mode
        return {
            filterOption: (input: string, option: OptionType | undefined) => (option?.label ?? "")
                .toString()
                .toLowerCase()
                .includes(input.toLowerCase()),
        };
    }, [searchMode, showSearch, onRemoteSearch]);

    return (
        <Select<ValueType, OptionType>
            options={mergedOptions}
            loading={loading}
            placeholder={placeholder}
            style={{ width: "100%" }}
            onPopupScroll={handlePopupScroll}
            // Allow space in search input
            onInputKeyDown={(e) => {
                if (e.key === ' ') {
                    e.stopPropagation(); // prevent Select from intercepting space
                }
            }}
            showSearch={showSearchConfig}
            onOpenChange={(open) => {
                isDropdownOpenRef.current = open; // track open state
                onDropdownVisibleChange?.(open);
            }}
            // Store selected option object before dropdown closes
            onSelect={(_val, option) => onSelectOption?.(option, rest?.mode as string)}
            onDeselect={(val) => onDeselectOption?.(val)}
            onClear={onClearAll}
            popupRender={(menu) => (
                <>
                    {menu}
                    {loading && (
                        <div className="flex items-center justify-center gap-2 py-2">
                            <Loader size="10" />
                            <span className="text-gray-400 text-sm">Loading...</span>
                        </div>
                    )}
                </>
            )}
            {...rest}
        />
    );
}

export default AppSelect;