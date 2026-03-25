import { Input, type InputProps } from 'antd'
import { debounce } from 'lodash';
import { useEffect, useMemo, useState, type ChangeEvent } from 'react';

interface SearchBar extends InputProps {
    defaultSearchValue?: string;
    setSearchDebouncedValue: React.Dispatch<React.SetStateAction<string>>
}

const DebounceSearchBar = ({ defaultSearchValue, setSearchDebouncedValue, ...res }: SearchBar) => {

    const [search, setSearch] = useState(defaultSearchValue ?? "");

    const debouncedFunction = useMemo(() =>
        debounce((value: any) => {
            setSearchDebouncedValue(value)
        }, 500)
        , []);

    useEffect(() => {
        return () => {
            debouncedFunction.cancel();
        };
    }, [debouncedFunction]);

    const searchHandler = (e: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        const value = e.target.value;
        setSearch(value);
        debouncedFunction(value);
    }

    return (
        <Input {...res} value={search} onChange={searchHandler} />
    )
}

export default DebounceSearchBar
