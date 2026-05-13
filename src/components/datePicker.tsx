import { DatePicker, type DatePickerProps } from 'antd'
import type { Dayjs } from 'dayjs'

interface AppDatePickerProps extends Omit<DatePickerProps, 'onChange'> {
    fullWidth?: boolean;
    onChange?: (isoString: string | null) => void;
}

const AppDatePicker = ({ format, showTime, onChange, ...rest }: AppDatePickerProps) => {

    const resolvedFormat = format ?? (showTime ? "YYYY/MM/DD HH:mm" : "YYYY/MM/DD");

    return (
        <DatePicker
            {...rest}
            showTime={showTime}
            format={resolvedFormat}
            onChange={(date) => {
                const dayjsDate = date as Dayjs | null;
                onChange?.(dayjsDate ? dayjsDate.format("YYYY-MM-DDTHH:mm:ss.SSS") : null);
            }}
        />
    )
}

export default AppDatePicker