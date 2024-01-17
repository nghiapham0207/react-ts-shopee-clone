import { ChangeEvent, InputHTMLAttributes, forwardRef, useState } from "react";

export interface InputNumberProps extends InputHTMLAttributes<HTMLInputElement> {
	errorMessage?: string;
	classNameInput?: string;
	classNameError?: string;
}

const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(
	(
		{
			errorMessage = "",
			className = "mt-8",
			classNameInput = "p-3 w-full outline-none border border-gray-300 focus:border-gray-500 focus:shadow-sm rounded-sm",
			classNameError = "mt-1 text-red-600 min-h-[1.25rem] text-sm",
			onChange,
			value,
			...rest
		}: InputNumberProps,
		ref,
	) => {
		const [localValue, setLocalValue] = useState<string>(value ? value.toString() : "");

		const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
			const { value } = event.target;
			if (/^\d+$/.test(value) || value === "") {
				// onChange truyền từ bên ngoài
				onChange && onChange(event);
				setLocalValue(value);
			}
		};
		return (
			<div className={className}>
				<input
					className={classNameInput}
					{...rest}
					value={value === undefined ? localValue : value}
					onChange={handleChange}
					ref={ref}
				/>
				<div className={classNameError}>{errorMessage}</div>
			</div>
		);
	},
);

export default InputNumber;
