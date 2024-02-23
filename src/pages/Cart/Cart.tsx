import { Link, useLocation } from "react-router-dom";
import { Fragment, useContext, useEffect, useMemo } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { produce } from "immer";

import { purchasesStatus } from "../../constants/purchase";
import purchaseApi from "../../apis/purchase.api";
import path from "../../constants/path";
import { formatCurrency, generateNameId } from "../../utils/utils";
import QuantityController from "../../components/QuantityController";
import Button from "../../components/Button";
import { IPurchase } from "../../types/purchase.type";
import keyBy from "lodash/keyBy";
import { toast } from "react-toastify";
import { AppContext } from "../../contexts/app.context";
import nothingInCart from "../../assets/images/nothing-in-cart.png";

export default function Cart() {
	const location = useLocation();
	const checkedPurchaseIdFromLocation = (location.state as { purchaseId: string } | null)
		?.purchaseId;
	const { extendedPurchases, setExtendedPurchases } = useContext(AppContext);
	const { data: purchasesInCartData, refetch } = useQuery({
		queryKey: ["purchases", { status: purchasesStatus.inCart }],
		queryFn: () => purchaseApi.getPurchases({ status: purchasesStatus.inCart }),
	});
	const updatePurchaseMutation = useMutation({
		mutationFn: purchaseApi.updatePurchase,
		onSuccess: () => {
			refetch();
		},
	});
	const buyProductsMutation = useMutation({
		mutationFn: purchaseApi.buyProducts,
		onSuccess: (data) => {
			refetch();
			toast.success(data.data.message, {
				position: "top-center",
				autoClose: 1000,
			});
		},
	});
	const deletePurchasesMutation = useMutation({
		mutationFn: purchaseApi.deletePurchase,
		onSuccess: () => {
			refetch();
		},
	});

	const purchasesInCart = purchasesInCartData?.data.data;
	const isAllChecked = useMemo(() => {
		return extendedPurchases.every((p) => p.checked === true);
	}, [extendedPurchases]);
	const checkedPurchases = useMemo(() => {
		return extendedPurchases.filter((p) => p.checked);
	}, [extendedPurchases]);
	const checkedPurchasesCount = checkedPurchases.length;
	const totalPriceOfCheckedPurchases = useMemo(() => {
		return checkedPurchases.reduce((prev, current) => {
			return prev + current.price * current.buy_count;
		}, 0);
	}, [checkedPurchases]);
	const totalSavingPriceOfCheckedPurchases = useMemo(() => {
		return checkedPurchases.reduce((prev, current) => {
			return prev + (current.price_before_discount - current.price) * current.buy_count;
		}, 0);
	}, [checkedPurchases]);

	useEffect(() => {
		if (purchasesInCart) {
			setExtendedPurchases((e) => {
				const extendedPurchasesObject = keyBy(e, "_id");
				return purchasesInCart.map((purchase) => {
					const isCheckedPurcaseFromLocation = checkedPurchaseIdFromLocation === purchase._id;
					return {
						...purchase,
						disabled: false,
						checked:
							isCheckedPurcaseFromLocation ||
							Boolean(extendedPurchasesObject[purchase._id]?.checked),
					};
				});
			});
		}
	}, [purchasesInCart, checkedPurchaseIdFromLocation, setExtendedPurchases]);
	useEffect(() => {
		return () => {
			history.replaceState(null, "");
		};
	}, []);

	const handleTypeQuantity = (purchaseIndex: number) => (value: number) => {
		setExtendedPurchases(
			produce((draft) => {
				draft[purchaseIndex].buy_count = value;
			}),
		);
	};
	const handleUpdateQuantity = (purchaseIndex: number, value: number, enabled: boolean) => {
		if (enabled) {
			const purchase = extendedPurchases[purchaseIndex];
			setExtendedPurchases(
				produce((draft) => {
					draft[purchaseIndex].disabled = true;
				}),
			);
			updatePurchaseMutation.mutate({ product_id: purchase.product._id, buy_count: value });
		}
	};
	const handleChecked = (purchaseIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
		setExtendedPurchases(
			produce((draft) => {
				draft[purchaseIndex].checked = event.target.checked;
			}),
		);
	};
	const handleCheckAll = () => {
		setExtendedPurchases((e) =>
			e.map((p) => ({
				...p,
				checked: !isAllChecked,
			})),
		);
	};
	const handleDelete = (purchaseIndex: number) => () => {
		const purchaseId = extendedPurchases[purchaseIndex]._id;
		deletePurchasesMutation.mutate([purchaseId]);
	};
	const handleDeleteManyPurchases = () => {
		const purchaseIds = checkedPurchases.map((p) => p._id);
		deletePurchasesMutation.mutate(purchaseIds);
	};
	const handleBuyProducts = () => {
		if (checkedPurchasesCount > 0) {
			const body = checkedPurchases.map((purchase) => ({
				product_id: purchase.product._id,
				buy_count: purchase.buy_count,
			}));
			buyProductsMutation.mutate(body);
		}
	};
	return (
		<div className="bg-neutral-100 py-16">
			<div className="container">
				{extendedPurchases.length > 0 ? (
					<Fragment>
						<div className="overflow-auto">
							<div className="min-w-[1000px]">
								{/* header */}
								<div className="grid grid-cols-12 rounded-sm bg-white px-9 py-5 text-sm capitalize text-gray-500 shadow">
									<div className="col-span-5 lg:col-span-6">
										<div className="flex items-center">
											<div className="flex flex-shrink-0 items-center justify-center pr-3">
												<input
													type="checkbox"
													className="h-5 w-5 accent-orange"
													checked={isAllChecked}
													onChange={handleCheckAll}
												/>
											</div>
											<div className="flex-grow capitalize text-black">sản phẩm</div>
										</div>
									</div>
									<div className="col-span-7 lg:col-span-6">
										<div className="grid grid-cols-7 text-center capitalize lg:grid-cols-5">
											<div className="col-span-3 lg:col-span-2">đơn giá</div>
											<div className="col-span-2 lg:col-span-1">số lượng</div>
											<div className="col-span-1">số tiền</div>
											<div className="col-span-1">thao tác</div>
										</div>
									</div>
								</div>
								{/* body */}
								{extendedPurchases.length > 0 && (
									<div className="my-3 rounded-sm bg-white p-5 shadow">
										{extendedPurchases.map((purchase, index) => (
											<div
												className="mt-4 grid grid-cols-12 items-center rounded-sm border border-gray-200 bg-white px-4 py-5 text-center text-sm text-gray-500 first:mt-0"
												key={purchase._id}>
												<div className="col-span-5 lg:col-span-6">
													<div className="flex">
														<div className="flex flex-shrink-0 items-center justify-center pr-3">
															<input
																type="checkbox"
																className="h-5 w-5 accent-orange"
																checked={purchase.checked}
																onChange={handleChecked(index)}
															/>
														</div>
														<div className="ml-2 flex-grow">
															<div className="flex">
																<Link
																	to={`${path.home}${generateNameId({
																		name: purchase.product.name,
																		id: purchase.product._id,
																	})}`}
																	className="h-20 w-20 flex-shrink-0">
																	<img src={purchase.product.image} alt={purchase.product.name} />
																</Link>
																<div className="flex-grow px-2 pb-2 pt-1">
																	<Link
																		to={`${path.home}${generateNameId({
																			name: purchase.product.name,
																			id: purchase.product._id,
																		})}`}
																		className="line-clamp-2 text-left">
																		{purchase.product.name}
																	</Link>
																</div>
															</div>
														</div>
													</div>
												</div>
												<div className="col-span-7 lg:col-span-6">
													<div className="grid grid-cols-7 items-center lg:grid-cols-5">
														<div className="col-span-3 lg:col-span-2">
															<div className="flex items-center justify-center">
																<span className="text-gray-300 line-through">
																	{"₫" + formatCurrency(purchase.product.price_before_discount)}
																</span>
																<span className="ml-3">
																	{"₫" + formatCurrency(purchase.product.price)}
																</span>
															</div>
														</div>
														<div className="col-span-2 flex justify-center lg:col-span-1">
															<QuantityController
																classNameWrapper="flex items-center"
																max={purchase.product.quantity}
																value={purchase.buy_count}
																onIncrease={(value) =>
																	handleUpdateQuantity(
																		index,
																		value,
																		value <= purchase.product.quantity,
																	)
																}
																onDecrease={(value) =>
																	handleUpdateQuantity(index, value, value >= 1)
																}
																onType={handleTypeQuantity(index)}
																onLostFocus={(value) =>
																	handleUpdateQuantity(
																		index,
																		value,
																		value >= 1 &&
																			value <= purchase.product.quantity &&
																			value !== (purchasesInCart as IPurchase[])[index].buy_count,
																	)
																}
																disabled={purchase.disabled}
															/>
														</div>
														<div className="col-span-1">
															<span className="text-orange">
																{"₫" + formatCurrency(purchase.product.price * purchase.buy_count)}
															</span>
														</div>
														<div className="col-span-1">
															<button
																type="button"
																onClick={handleDelete(index)}
																className="bg-none text-black transition-colors hover:text-orange">
																Xóa
															</button>
														</div>
													</div>
												</div>
											</div>
										))}
									</div>
								)}
							</div>
						</div>
						{/* footer */}
						<div className="sticky bottom-0 z-10 mt-10 flex flex-col rounded-sm border border-gray-100 bg-white p-2 shadow sm:flex-row sm:items-center md:p-5">
							<div className="flex items-center">
								<div className="flex flex-shrink-0 items-center justify-center pr-3">
									<input
										type="checkbox"
										className="h-5 w-5 accent-orange"
										checked={isAllChecked}
										onChange={handleCheckAll}
									/>
								</div>
								<button
									type="button"
									className="mx-3 border-none bg-none text-xs md:text-base"
									onClick={handleCheckAll}>
									{`Chọn tất cả (${extendedPurchases.length})`}
								</button>
								<button
									type="button"
									onClick={handleDeleteManyPurchases}
									className="mx-3 border-none bg-none">
									Xóa
								</button>
							</div>
							<div className="mt-5 flex flex-col sm:ml-auto sm:mt-0 md:flex-row md:items-center">
								<div>
									<div className="flex items-center sm:justify-end">
										<div className="text-xs md:text-base">{`Tổng thanh toán (${checkedPurchasesCount} sản phẩm):`}</div>
										<div className="ml-2 text-sm text-orange md:text-2xl">{`₫${formatCurrency(
											totalPriceOfCheckedPurchases,
										)}`}</div>
									</div>
									<div className="flex items-center text-sm sm:justify-end">
										<div className="text-gray-500">Tiết kiệm</div>
										<div className="ml-6 text-orange">{`₫${formatCurrency(
											totalSavingPriceOfCheckedPurchases,
										)}`}</div>
									</div>
								</div>
								<Button
									type="button"
									onClick={handleBuyProducts}
									disabled={buyProductsMutation.isPending}
									className="mt-5 flex h-10 w-full items-center justify-center bg-red-500 capitalize text-white hover:bg-red-600 sm:mt-0 md:ml-4 md:max-w-[150px] lg:w-52">
									Mua Hàng
								</Button>
							</div>
						</div>
					</Fragment>
				) : (
					<div className="flex flex-col items-center justify-center">
						<img src={nothingInCart} alt="nothin in cart" className="h-24 w-24" />
						<div className="mt-5 font-bold text-gray-400">Giỏ hàng của bạn còn trống</div>
						<Link
							to={path.home}
							className="mt-5 bg-orange px-8 py-2 uppercase text-white hover:bg-orange/80">
							mua ngay
						</Link>
					</div>
				)}
			</div>
		</div>
	);
}
