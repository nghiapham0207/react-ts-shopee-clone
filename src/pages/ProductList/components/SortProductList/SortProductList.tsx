import omit from "lodash/omit";
import { Link, createSearchParams, useNavigate } from "react-router-dom";
import classNames from "classnames";

import { sortBy } from "../../../../constants/product";
import { ProductListConfig } from "../../../../types/product.type";
import path from "../../../../constants/path";
import { order as orderConstant } from "../../../../constants/product";
import { QueryConfig } from "../../../../hooks/useQueryConfig";
import { Fragment, useEffect, useState } from "react";

interface SortProductListProps {
	queryConfig: QueryConfig;
	pageSize: number;
}

type TSortByValue = Exclude<ProductListConfig["sort_by"], undefined>;
type TOrderValue = Exclude<ProductListConfig["order"], undefined>;

const prefixOption = {
	sortBy: "sortby-",
	order: "order-",
};

export default function SortProductList({ queryConfig, pageSize }: SortProductListProps) {
	const mediaQuery = window.matchMedia("(min-width: 1024px)");
	const [lgScreen, setLgScreen] = useState(mediaQuery.matches);
	const page = Number(queryConfig.page);
	const { sort_by = sortBy.createdAt, order } = queryConfig;
	const navigate = useNavigate();
	const isActiveSortBy = (sortByValue: TSortByValue) => {
		return sort_by === sortByValue;
	};

	const handleSort = (sortByValue: TSortByValue) => {
		navigate({
			pathname: path.home,
			search: createSearchParams(
				omit(
					{
						...queryConfig,
						sort_by: sortByValue,
					},
					["order"],
				),
			).toString(),
		});
	};
	const handlePriceOrder = (orderValue: TOrderValue) => {
		navigate({
			pathname: path.home,
			search: createSearchParams({
				...queryConfig,
				sort_by: sortBy.price,
				order: orderValue,
			}).toString(),
		});
	};

	useEffect(() => {
		const handleChangeScreen = () => {
			setLgScreen(mediaQuery.matches);
		};
		mediaQuery.addEventListener("change", handleChangeScreen);
		return () => {
			mediaQuery.removeEventListener("change", handleChangeScreen);
		};
	}, [mediaQuery]);
	return (
		<div className="bg-gray-300/40 px-3 py-2 md:py-4">
			<div className="flex flex-wrap items-center justify-between gap-2">
				<div className="flex flex-wrap items-center gap-2 [&>button]:text-xs md:[&>button]:text-sm [&>select]:text-xs md:[&>select]:text-sm">
					<div className="text-xs md:text-sm">Sắp xếp theo</div>
					{lgScreen && (
						<Fragment>
							<button
								className={classNames("h-8 px-2 text-center capitalize md:px-4", {
									"bg-orange text-white hover:bg-orange/80": isActiveSortBy(sortBy.view),
									"bg-white text-black hover:bg-slate-100": !isActiveSortBy(sortBy.view),
								})}
								onClick={() => handleSort(sortBy.view)}>
								phổ biến
							</button>
							<button
								className={classNames("h-8 px-2 text-center capitalize md:px-4", {
									"bg-orange text-white hover:bg-orange/80": isActiveSortBy(sortBy.createdAt),
									"bg-white text-black hover:bg-slate-100": !isActiveSortBy(sortBy.createdAt),
								})}
								onClick={() => handleSort(sortBy.createdAt)}>
								mới nhất
							</button>
							<button
								className={classNames("h-8 px-2 text-center capitalize md:px-4", {
									"bg-orange text-white hover:bg-orange/80": isActiveSortBy(sortBy.sold),
									"bg-white text-black hover:bg-slate-100": !isActiveSortBy(sortBy.sold),
								})}
								onClick={() => handleSort(sortBy.sold)}>
								bán chạy
							</button>
							<select
								aria-labelledby="price of product"
								className={classNames(
									"text-lef h-8 bg-white px-2 capitalize outline-none md:px-4",
									{
										"text-orange": isActiveSortBy(sortBy.price),
										"text-black": !isActiveSortBy(sortBy.price),
									},
								)}
								value={order || ""}
								onChange={(event) => {
									handlePriceOrder(event.target.value as TOrderValue);
								}}>
								<option className="text-black" value="" disabled>
									Giá
								</option>
								<option className="text-black" value={orderConstant.asc}>
									Giá: thấp đến cao
								</option>
								<option className="text-black" value={orderConstant.desc}>
									Giá: cao đến thấp
								</option>
							</select>
						</Fragment>
					)}
					{!lgScreen && (
						<select
							className="h-8 px-2 text-left capitalize focus:outline-orange"
							onChange={(evt) => {
								const array = evt.target.value.split("-");
								const prefix = array[0] + "-";
								const value = array[1];
								if (prefix === prefixOption.sortBy) {
									handleSort(value as TSortByValue);
								} else if (prefix === prefixOption.order) {
									handlePriceOrder(value as TOrderValue);
								}
							}}>
							<option
								className="h-8 px-2 py-2 capitalize"
								value={prefixOption.sortBy + sortBy.view}>
								phổ biến
							</option>
							<option
								className="h-8 px-2 py-2 capitalize"
								value={prefixOption.sortBy + sortBy.createdAt}>
								mới nhất
							</option>
							<option
								className="h-8 px-2 py-2 capitalize"
								value={prefixOption.sortBy + sortBy.sold}>
								bán chạy
							</option>
							<option value={prefixOption.order + orderConstant.asc}>giá tăng dần</option>
							<option value={prefixOption.order + orderConstant.desc}>giá giảm dần</option>
						</select>
					)}
				</div>
				<div className="flex items-center">
					<div>
						<span className="text-orange">{page}</span>
						<span>/{pageSize}</span>
					</div>
					<div className="ml-2 flex">
						{page === 1 ? (
							<span className="flex cursor-not-allowed items-center rounded-bl-sm rounded-tl-sm bg-white/60 px-3 py-2 shadow-sm">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth="1.5"
									stroke="currentColor"
									className="h-3 w-3">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M15.75 19.5 8.25 12l7.5-7.5"
									/>
								</svg>
							</span>
						) : (
							<Link
								to={{
									pathname: path.home,
									search: createSearchParams({
										...queryConfig,
										page: (page - 1).toString(),
									}).toString(),
								}}
								className="flex h-8 items-center rounded-bl-sm rounded-tl-sm bg-white/60 px-3 shadow hover:bg-slate-100">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth="1.5"
									stroke="currentColor"
									className="h-3 w-3">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M15.75 19.5 8.25 12l7.5-7.5"
									/>
								</svg>
							</Link>
						)}
						{page === pageSize ? (
							<span className="flex cursor-not-allowed items-center rounded-br-sm rounded-tr-sm bg-white/60 px-3 py-2 shadow-sm">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth="1.5"
									stroke="currentColor"
									className="h-3 w-3">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="m8.25 4.5 7.5 7.5-7.5 7.5"
									/>
								</svg>
							</span>
						) : (
							<Link
								to={{
									pathname: path.home,
									search: createSearchParams({
										...queryConfig,
										page: (page + 1).toString(),
									}).toString(),
								}}
								className="flex h-8 items-center rounded-br-sm rounded-tr-sm bg-white px-3 shadow hover:bg-slate-100">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth="1.5"
									stroke="currentColor"
									className="h-3 w-3">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="m8.25 4.5 7.5 7.5-7.5 7.5"
									/>
								</svg>
							</Link>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
