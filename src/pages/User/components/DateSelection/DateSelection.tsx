import range from "lodash/range";
import { useEffect, useState } from "react";

interface Props {
	onChange?: (value: Date) => void;
	value?: Date;
	errorMessage?: string;
}

export default function DateSelection({ value, onChange, errorMessage }: Props) {
	const [date, setDate] = useState({
		date: value?.getDate() || 1,
		month: value?.getMonth() || 0,
		year: value?.getFullYear() || 1910,
	});

	const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const { value: selectedValue, name } = event.target;
		const newDate = {
			date: value?.getDate() || date.date,
			month: value?.getMonth() || date.month,
			year: value?.getFullYear() || date.year,
			[name]: Number(selectedValue),
		};
		setDate(newDate);
		onChange && onChange(new Date(newDate.year, newDate.month, newDate.date));
	};

	useEffect(() => {
		if (value) {
			setDate({
				date: value.getDate(),
				month: value.getMonth(),
				year: value.getFullYear(),
			});
		}
	}, [value]);
	return (
		<div className="mt-2 flex flex-wrap sm:flex-row">
			<div className="truncate pt-3 capitalize sm:w-[20%] sm:text-right">Ngày sinh</div>
			<div className="sm:w-[80%] sm:pl-5">
				<div className="flex justify-between">
					<select
						onChange={handleChange}
						name="date"
						value={value?.getDate() || date.date}
						className="h-10 w-[32%] cursor-pointer rounded-sm border border-black/10 px-3 hover:border-orange">
						{range(1, 32).map((d) => (
							<option value={d} key={d} className="hover:bg-transparent">
								{d}
							</option>
						))}
					</select>
					<select
						onChange={handleChange}
						name="month"
						value={value?.getMonth() || date.month}
						className="h-10 w-[32%] cursor-pointer rounded-sm border border-black/10 px-3 hover:border-orange">
						{range(0, 12).map((m) => (
							<option value={m} key={m}>
								{"Tháng " + (m + 1)}
							</option>
						))}
					</select>
					<select
						onChange={handleChange}
						name="year"
						value={value?.getFullYear() || date.year}
						className="h-10 w-[32%] cursor-pointer rounded-sm border border-black/10 px-3 hover:border-orange">
						{range(1910, new Date().getFullYear() + 1)
							.reverse()
							.map((y) => (
								<option value={y} key={y}>
									{y}
								</option>
							))}
					</select>
				</div>
				<div className="mt-1 min-h-[1.25rem] text-sm text-red-600">{errorMessage}</div>
			</div>
		</div>
	);
}
