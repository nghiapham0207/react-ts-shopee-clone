import omit from "lodash/omit";
import { Link, createSearchParams, useNavigate } from "react-router-dom";
import classNames from "classnames";

import { sortBy } from "../../../../constants/product";
import { ProductListConfig } from "../../../../types/product.type";
import path from "../../../../constants/path";
import { order as orderConstant } from "../../../../constants/product";
import { QueryConfig } from "../../../../hooks/useQueryConfig";

interface SortProductListProps {
	queryConfig: QueryConfig;
	pageSize: number;
}

export default function SortProductList({ queryConfig, pageSize }: SortProductListProps) {
	const page = Number(queryConfig.page);
	const { sort_by = sortBy.createdAt, order } = queryConfig;
	const navigate = useNavigate();
	const isActiveSortBy = (sortByValue: Exclude<ProductListConfig["sort_by"], undefined>) => {
		return sort_by === sortByValue;
	};
	const handleSort = (sortByValue: Exclude<ProductListConfig["sort_by"], undefined>) => {
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
	const handlePriceOrder = (orderValue: Exclude<ProductListConfig["order"], undefined>) => {
		navigate({
			pathname: path.home,
			search: createSearchParams({
				...queryConfig,
				sort_by: sortBy.price,
				order: orderValue,
			}).toString(),
		});
	};
	return (
		<div className="bg-gray-300/40 px-3 py-4">
			<div className="flex flex-wrap items-center justify-between gap-2">
				<div className="flex flex-wrap items-center gap-2">
					<div>Sắp xếp theo</div>
					<button
						className={classNames("h-8 px-4 text-center  text-sm  capitalize", {
							"bg-orange text-white hover:bg-orange/80": isActiveSortBy(sortBy.view),
							"bg-white text-black hover:bg-slate-100": !isActiveSortBy(sortBy.view),
						})}
						onClick={() => handleSort(sortBy.view)}>
						phổ biến
					</button>
					<button
						className={classNames("h-8 px-4 text-center  text-sm  capitalize", {
							"bg-orange text-white hover:bg-orange/80": isActiveSortBy(sortBy.createdAt),
							"bg-white text-black hover:bg-slate-100": !isActiveSortBy(sortBy.createdAt),
						})}
						onClick={() => handleSort(sortBy.createdAt)}>
						mới nhất
					</button>
					<button
						className={classNames("h-8 px-4 text-center  text-sm  capitalize", {
							"bg-orange text-white hover:bg-orange/80": isActiveSortBy(sortBy.sold),
							"bg-white text-black hover:bg-slate-100": !isActiveSortBy(sortBy.sold),
						})}
						onClick={() => handleSort(sortBy.sold)}>
						bán chạy
					</button>
					<select
						aria-labelledby="price of product"
						className={classNames("h-8 bg-white px-4 text-left text-sm capitalize outline-none", {
							"text-orange": isActiveSortBy(sortBy.price),
							"text-black": !isActiveSortBy(sortBy.price),
						})}
						value={order || ""}
						onChange={(event) => {
							handlePriceOrder(
								event.target.value as Exclude<ProductListConfig["order"], undefined>,
							);
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
