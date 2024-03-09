import classNames from "classnames";
import { yupResolver } from "@hookform/resolvers/yup";
import omit from "lodash/omit";
import omitBy from "lodash/omitBy";
import isEmpty from "lodash/isEmpty";
import { useForm, Controller } from "react-hook-form";
import { Link, createSearchParams, useNavigate } from "react-router-dom";

import path from "../../../../constants/path";
import Button from "../../../../components/Button";
import InputNumber from "../../../../components/InputNumber";
import { schema, Schema } from "../../../../utils/rules";
import { NoUndefinedField } from "../../../../types/utils.type";
import RatingStars from "../RatingStars";
import useQueryConfig from "../../../../hooks/useQueryConfig";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import categoryApi from "../../../../apis/category.api";

const MAX_LEN_INPUT_PRICE = 13;

type FormData = NoUndefinedField<Pick<Schema, "price_max" | "price_min">>;
// type FormData = Pick<Schema, "price_max" | "price_min">;

const priceSchema = schema.pick(["price_min", "price_max"]);

export default function AsideFilter() {
	const queryConfig = useQueryConfig();
	const { category } = queryConfig;
	const navigate = useNavigate();
	const { t } = useTranslation(["home"]);

	const { data: categoriesData } = useQuery({
		queryKey: ["categories"],
		queryFn: () => {
			return categoryApi.getCategories();
		},
	});
	const categories = categoriesData?.data.data || [];
	const {
		control,
		trigger,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<FormData>({
		defaultValues: {
			price_min: "",
			price_max: "",
		},
		resolver: yupResolver(priceSchema),
	});
	const onSubmit = handleSubmit((data) => {
		navigate({
			pathname: path.home,
			search: createSearchParams(
				omitBy(
					{
						...queryConfig,
						price_max: data.price_max || "",
						price_min: data.price_min || "",
					},
					isEmpty,
				),
			).toString(),
		});
	});
	const handleClearFilter = () => {
		reset();
		navigate({
			pathname: path.home,
			search: createSearchParams(
				omit(queryConfig, ["price_max", "price_min", "rating_filter", "category"]),
			).toString(),
		});
	};
	return (
		<div className="py-4">
			<Link
				to={path.home}
				className={classNames("flex items-center font-bold", {
					"text-orange": !category,
				})}>
				<svg viewBox="0 0 12 10" className="mr-3 h-4 w-3 fill-current">
					<g fillRule="evenodd" stroke="none" strokeWidth={1}>
						<g transform="translate(-373 -208)">
							<g transform="translate(155 191)">
								<g transform="translate(218 17)">
									<path d="m0 2h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z" />
									<path d="m0 6h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z" />
									<path d="m0 10h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z" />
								</g>
							</g>
						</g>
					</g>
				</svg>
				{t("aside filter.all categories")}
			</Link>
			<div className="my-4 h-[1px] bg-gray-300"></div>
			<ul>
				{categories.map((item) => {
					const isActive = category === item._id;
					return (
						<li className="py-2 pl-2" key={item._id}>
							<Link
								to={{
									pathname: path.home,
									search: createSearchParams({
										...queryConfig,
										category: item._id,
									}).toString(),
								}}
								className={classNames("relative px-2 capitalize", {
									"font-semibold text-orange": isActive,
								})}>
								{isActive && (
									<svg
										viewBox="0 0 4 7"
										className="absolute left-[-10px] top-1 h-2 w-2 fill-orange">
										<polygon points="4 3.5 0 0 0 7" />
									</svg>
								)}
								{item.name}
							</Link>
						</li>
					);
				})}
			</ul>
			<Link to={path.home} className="mt-4 flex items-center font-bold uppercase">
				<svg
					enableBackground="new 0 0 15 15"
					viewBox="0 0 15 15"
					x={0}
					y={0}
					className="mr-3 h-4 w-3 fill-current stroke-current">
					<g>
						<polyline
							fill="none"
							points="5.5 13.2 5.5 5.8 1.5 1.2 13.5 1.2 9.5 5.8 9.5 10.2"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeMiterlimit={10}
						/>
					</g>
				</svg>
				{t("aside filter.search filter")}
			</Link>
			<div className="my-4 h-[1px] bg-gray-300"></div>
			<div className="my-5">
				<div>Khoảng giá</div>
				<form className="mt-2" onSubmit={onSubmit}>
					<div className="flex items-start">
						<Controller
							name="price_min"
							control={control}
							render={({ field }) => {
								return (
									<InputNumber
										type="text"
										maxLength={MAX_LEN_INPUT_PRICE}
										className="grow"
										placeholder="₫ TỪ"
										classNameError="hidden"
										classNameInput="p-1 w-full outline-none border border-gray-300 focus:border-gray-500 focus:shadow-sm rounded-sm"
										{...field}
										onChange={(e) => {
											field.onChange(e);
											trigger("price_max");
										}}
									/>
								);
							}}
						/>
						<div className="mx-2 my-2 shrink-0">-</div>
						<Controller
							name="price_max"
							control={control}
							render={({ field }) => {
								return (
									<InputNumber
										type="text"
										maxLength={MAX_LEN_INPUT_PRICE}
										className="grow"
										placeholder="₫ ĐẾN"
										classNameError="hidden"
										classNameInput="p-1 w-full outline-none border border-gray-300 focus:border-gray-500 focus:shadow-sm rounded-sm"
										{...field}
										onChange={(e) => {
											field.onChange(e);
											trigger("price_min");
										}}
									/>
								);
							}}
						/>
					</div>
					<div className="mb-2 mt-1 min-h-[1.25rem] text-sm text-red-600">
						{errors.price_min?.message}
					</div>
					<Button
						isLoading={false}
						className="hover:bg-orange-80 flex w-full items-center justify-center rounded-sm bg-orange p-2 text-sm uppercase text-white">
						áp dụng
					</Button>
				</form>
			</div>
			<div className="my-4 h-[1px] bg-gray-300"></div>
			<div className="text-sm">Đánh giá</div>
			<RatingStars queryConfig={queryConfig} />
			<div className="my-4 h-[1px] bg-gray-300"></div>
			<Button
				onClick={handleClearFilter}
				className="hover:bg-orange-80 flex w-full items-center justify-center rounded-sm bg-orange px-2 py-2 text-sm uppercase text-white">
				Xóa tất cả
			</Button>
		</div>
	);
}
