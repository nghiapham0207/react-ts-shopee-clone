import { Link, createSearchParams } from "react-router-dom";
import classNames from "classnames";

import path from "../../../../constants/path";
import { purchasesStatus } from "../../../../constants/purchase";
import useQueryParams from "../../../../hooks/useQueryParams";
import { useQuery } from "@tanstack/react-query";
import purchaseApi from "../../../../apis/purchase.api";
import { PurchaseListStatus } from "../../../../types/purchase.type";
import { formatCurrency, generateNameId } from "../../../../utils/utils";

const purchaseTabs = [
	{
		status: purchasesStatus.all,
		name: "Tất cả",
	},
	{
		status: purchasesStatus.waitForConfirmation,
		name: "Chờ xác nhận",
	},
	{
		status: purchasesStatus.waitForGetting,
		name: "Chờ lấy hàng",
	},
	{
		status: purchasesStatus.inProgress,
		name: "Đang giao",
	},
	{
		status: purchasesStatus.delivered,
		name: "Hoàn thành",
	},
	{
		status: purchasesStatus.cancelled,
		name: "Đã hủy",
	},
];

export default function HistoryPurchase() {
	const queryParams: { status?: string } = useQueryParams();
	const status: number = Number(queryParams.status) || purchasesStatus.all;
	const { data } = useQuery({
		queryKey: ["purchases", { status }],
		queryFn: () => purchaseApi.getPurchases({ status: status as PurchaseListStatus }),
	});
	const purchases = data?.data.data;

	return (
		<div className="overflow-auto">
			<div className="min-w-[700px]">
				<div className="sticky top-0 flex overflow-hidden rounded shadow-sm">
					{purchaseTabs.map((tab) => (
						<Link
							key={tab.status}
							to={{
								pathname: path.historyPurchase,
								search: createSearchParams({ status: tab.status.toString() }).toString(),
							}}
							className={classNames(
								"flex flex-1 items-center justify-center border-b-2 bg-white py-4 text-center",
								{
									"border-b-orange text-orange": status === tab.status,
									"border-b-black/10 text-gray-900": status !== tab.status,
								},
							)}>
							{tab.name}
						</Link>
					))}
				</div>
				<div className="">
					{purchases?.map((p) => (
						<div
							key={p._id}
							className="mt-4 rounded border-black/10 bg-white p-6 text-gray-800 shadow-sm">
							<Link
								to={`${path.home}${generateNameId({
									name: p.product.name,
									id: p.product._id,
								})}`}
								className="flex">
								<div className="shrink-0">
									<img
										src={p.product.image}
										alt={p.product.name}
										className="h-20 w-20 object-cover"
									/>
								</div>
								<div className="ml-3 grow overflow-hidden">
									<div className="truncate">{p.product.name}</div>
									<div className="mt-3">{"x" + p.buy_count}</div>
								</div>
								<div className="ml-3 shrink-0">
									<span className="truncate text-gray-500 line-through">
										{"₫" + formatCurrency(p.price_before_discount)}
									</span>
									<span className="ml-1 truncate text-orange">{"₫" + formatCurrency(p.price)}</span>
								</div>
							</Link>
							<div className="flex justify-end">
								<div className="">
									<span>Thành tiền:</span>
									<span className="ml-4 text-xl text-orange">
										{"₫" + formatCurrency(p.buy_count * p.price)}
									</span>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
