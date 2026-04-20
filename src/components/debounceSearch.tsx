import { Input, type InputProps } from 'antd'
import { debounce } from 'lodash';
import { useEffect, useRef, useState, type ChangeEvent } from 'react';

interface SearchBar extends InputProps {
    defaultSearchValue?: string;
    setSearchDebouncedValue: (value: string) => void;
    placeholder?: string;
    resetKey?: number;
}

const DebounceSearchBar = ({ defaultSearchValue, setSearchDebouncedValue, resetKey = 0, placeholder = '', ...res }: SearchBar) => {
    const [search, setSearch] = useState(defaultSearchValue ?? "");
    const [prevResetKey, setPrevResetKey] = useState(resetKey);

    if (prevResetKey !== resetKey) {
        setPrevResetKey(resetKey);
        setSearch("");
    }

    const callbackRef = useRef(setSearchDebouncedValue);
    const debouncedRef = useRef<ReturnType<typeof debounce> | null>(null);

    useEffect(() => {
        callbackRef.current = setSearchDebouncedValue;
    }, [setSearchDebouncedValue]);

    useEffect(() => {
        debouncedRef.current = debounce((value: string) => {
            callbackRef.current(value);
        }, 500);

        return () => {
            debouncedRef.current?.cancel();
        };
    }, []);

    const searchHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearch(value);
        debouncedRef.current?.(value);
    };

    return (
        <Input {...res} value={search} onChange={searchHandler} placeholder={placeholder} />
    );
};

export default DebounceSearchBar;