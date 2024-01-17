import { ChangeEvent, InputHTMLAttributes, useState } from "react";
import { FieldPath, FieldValues, UseControllerProps, useController } from "react-hook-form";

export interface InputV2Props extends InputHTMLAttributes<HTMLInputElement> {
	classNameInput?: string;
	classNameError?: string;
}

function InputV2<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: UseControllerProps<TFieldValues, TName> & InputV2Props) {
	const {
		type,
		onChange,
		className,
		classNameInput = "p-3 w-full outline-none border border-gray-300 focus:border-gray-500 focus:shadow-sm rounded-sm",
		classNameError = "mt-1 text-red-600 min-h-[1.25rem] text-sm",
		value = "",
		...rest
	} = props;
	const { field, fieldState } = useController(props);
	const [localValue, setLocalValue] = useState<string>(field.value);

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const inputValue = event.target.value;
		const numberCondition = type === "number" && (/^\d+$/.test(inputValue) || inputValue === "");
		if (numberCondition || type !== "number") {
			setLocalValue(inputValue);
			field.onChange(event);
			// onChange truyền từ bên ngoài
			onChange && onChange(event);
		}
	};
	return (
		<div className={className}>
			<input
				className={classNameInput}
				{...rest}
				{...field}
				value={value || localValue}
				onChange={handleChange}
			/>
			<div className={classNameError}>{fieldState.error?.message}</div>
		</div>
	);
}

export default InputV2;
