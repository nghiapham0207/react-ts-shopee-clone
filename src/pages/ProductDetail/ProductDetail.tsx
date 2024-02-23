import DOMPurify from "dompurify";
import { toast } from "react-toastify";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

import productApi from "../../apis/product.api";
import ProductRating from "../../components/ProductRating";
import {
	formatCurrency,
	formatNumberToSocialStyle,
	getIdFromNameId,
	rateSale,
} from "../../utils/utils";
import { Product as ProductType } from "../../types/product.type";
import Product from "../ProductList/components/Product";
import QuantityController from "../../components/QuantityController";
import purchaseApi from "../../apis/purchase.api";
import { purchasesStatus } from "../../constants/purchase";
import path from "../../constants/path";
import { useTranslation } from "react-i18next";
import ProductDetailSkeleton from "./ProductDetailSkeleton";
import { AppContext } from "../../contexts/app.context";
import noProductFound from "../../assets/images/nothing-in-cart.png";

const NoProductFound = () => {
	return (
		<div className="bg-gray-100">
			<div className="container">
				<div className="flex h-96 flex-col items-center justify-center">
					<img className="h-52 w-52" src={noProductFound} alt="product is not found!" />
					<span className="text-sm">Sản phẩm này không tồn tại</span>
				</div>
			</div>
		</div>
	);
};

export default function ProductDetail() {
	const { isAuthenticated } = useContext(AppContext);
	const { t } = useTranslation(["product"]);
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { nameId } = useParams();
	const id = getIdFromNameId(nameId as string);
	const { data: productState, isLoading } = useQuery({
		queryKey: ["product", id],
		queryFn: () => productApi.getProductDetail(id as string),
	});

	const product = productState?.data.data;
	console.log("product", product);

	const [currentIndexImages, setCurrentIndexImages] = useState([0, 5]);
	const [activeImage, setActiveImage] = useState("");
	const [buyCount, setBuyCount] = useState(1);
	const imageRef = useRef<HTMLImageElement>(null);

	const currentImages = useMemo(() => {
		return product ? product?.images.slice(...currentIndexImages) : [];
	}, [product, currentIndexImages]);

	const queryConfig = { limit: "10", page: "1", category: product?.category._id };
	const { data: productsData } = useQuery({
		queryKey: ["products", queryConfig],
		queryFn: () => {
			return productApi.getProducts(queryConfig);
		},
		enabled: Boolean(product),
		staleTime: 3 * 1000 * 60,
	});
	const addToCartMutation = useMutation({
		mutationFn: purchaseApi.addToCart,
	});

	useEffect(() => {
		if (product && product.images.length) {
			setActiveImage(product?.images[0]);
		}
	}, [product]);

	const requireLogin = () => {
		const pathname = window.location.pathname;
		if (!isAuthenticated) {
			return navigate(`${path.login}?next=${encodeURIComponent(pathname)}`);
		}
	};
	const addToCart = () => {
		requireLogin();
		addToCartMutation.mutate(
			{ buy_count: buyCount, product_id: product?._id as string },
			{
				onSuccess: (data) => {
					toast.success(data.data.message, {
						closeButton: true,
						autoClose: 1000,
					});
					queryClient.invalidateQueries({
						queryKey: ["purchases", { status: purchasesStatus.inCart }],
					});
				},
			},
		);
	};
	const handleBuyNow = async () => {
		requireLogin();
		try {
			const res = await addToCartMutation.mutateAsync({
				buy_count: buyCount,
				product_id: product?._id as string,
			});
			const purchase = res.data.data;
			navigate(path.cart, {
				state: {
					purchaseId: purchase._id,
				},
			});
		} catch (error) {
			console.log(error);
		}
	};
	const next = () => {
		if (currentIndexImages[1] < (product as ProductType).images.length) {
			setCurrentIndexImages((prev) => [prev[0] + 1, prev[1] + 1]);
		}
	};
	const prev = () => {
		if (currentIndexImages[0] > 0) {
			setCurrentIndexImages((prev) => [prev[0] - 1, prev[1] - 1]);
		}
	};
	const chooseActive = (img: string) => {
		setActiveImage(img);
	};
	const handleZoom = (evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		const image = imageRef.current as HTMLImageElement;
		const { naturalWidth, naturalHeight } = image;
		const rect = evt.currentTarget.getBoundingClientRect();
		const { offsetX, offsetY } = evt.nativeEvent;
		const top = offsetY * (1 - naturalHeight / rect.height);
		const left = offsetX * (1 - naturalWidth / rect.width);
		image.style.width = naturalWidth + "px";
		image.style.height = naturalHeight + "px";
		image.style.maxWidth = "unset";
		image.style.top = top + "px";
		image.style.left = left + "px";
	};
	const handleRemoveZoom = () => {
		(imageRef.current as HTMLImageElement).removeAttribute("style");
	};

	const handleBuyCount = (value: number) => {
		setBuyCount(value);
	};

	if (!product && isLoading) {
		return <ProductDetailSkeleton />;
	}
	if (!product) {
		return <NoProductFound />;
	}
	return (
		<div className="bg-gray-200 py-6">
			<div className="container">
				<div className="bg-white p-2 shadow sm:p-4">
					<div className="flex flex-col gap-6 lg:grid lg:grid-rows-2 lg:gap-9 xl:grid-cols-12 xl:grid-rows-none">
						<div className="lg:row-span-1 xl:col-span-5">
							<div
								className="relative w-full overflow-hidden pt-[100%] shadow hover:cursor-zoom-in"
								onMouseMove={handleZoom}
								onMouseLeave={handleRemoveZoom}>
								<img
									ref={imageRef}
									src={activeImage}
									alt={activeImage}
									style={{}}
									className="pointer-events-none absolute left-0 top-0 h-full w-full bg-white object-cover"
								/>
							</div>
							<div className="relative mt-4 grid grid-cols-5 gap-1">
								<button
									type="button"
									onClick={prev}
									className="absolute left-1 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth="3"
										stroke="currentColor"
										className="h-5 w-5">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M15.75 19.5 8.25 12l7.5-7.5"
										/>
									</svg>
								</button>
								{currentImages.slice(0, 5).map((image, index) => {
									const isActive = image === activeImage;
									return (
										<div
											onMouseEnter={() => {
												chooseActive(image);
											}}
											className="relative w-full pt-[100%]"
											key={index}>
											<img
												src={image}
												alt={product.name}
												className="absolute left-0 top-0 h-full w-full cursor-pointer bg-white object-cover"
											/>
											{isActive && (
												<div className="absolute inset-0 h-full w-full border-2 border-orange"></div>
											)}
										</div>
									);
								})}
								<button
									type="button"
									onClick={next}
									className="absolute right-1 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth="3"
										stroke="currentColor"
										className="h-6 w-6">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="m8.25 4.5 7.5 7.5-7.5 7.5"
										/>
									</svg>
								</button>
							</div>
						</div>
						<div className="lg:row-span-1 xl:col-span-7">
							<h1 className="text-xl font-medium capitalize">{product.name}</h1>
							<div className="mt-3 flex items-center">
								<div className="flex items-center">
									<span className="mr-1 border-b border-orange text-orange">{product.rating}</span>
									<ProductRating
										rating={product.rating}
										activeClassName="w-4 h-4 fill-orange text-orange"
										nonActiveClassName="h-4 w-4 fill-current text-gray-300"
									/>
								</div>
								<div className="mx-4 h-4 w-[1px] bg-gray-300"></div>
								<div className="">
									<span>{formatNumberToSocialStyle(product.sold)}</span>
									<span className="ml-1 capitalize text-gray-500">Đã bán</span>
								</div>
							</div>
							{/* discount */}
							<div className="mt-8 flex items-center bg-gray-50 px-2 py-2 md:px-5 md:py-4">
								<div className="text-xs text-gray-500 line-through sm:text-base">
									{"₫" + formatCurrency(product.price_before_discount)}
								</div>
								<div className="ml-3 text-sm font-medium text-orange sm:text-xl md:text-3xl">
									{"₫" + formatCurrency(product.price)}
								</div>
								<div className="ml-4 rounded-sm bg-orange px-1 py-[2px] text-xs font-semibold uppercase text-white">
									{rateSale(product.price_before_discount, product.price) + " giảm"}
								</div>
							</div>
							{/* end discount */}
							<div className="mt-8 flex items-start sm:items-center">
								<div className="text-xs capitalize text-gray-500 sm:text-base">số lượng</div>
								<div className="flex flex-col justify-end sm:flex-row sm:items-center">
									<QuantityController
										onDecrease={handleBuyCount}
										onIncrease={handleBuyCount}
										onType={handleBuyCount}
										value={buyCount}
										max={product.quantity}
									/>
									<div className="ml-10 mt-2 text-xs text-gray-500 sm:ml-6 sm:mt-0 sm:text-sm">
										{product.quantity} {t("available products")}
									</div>
								</div>
							</div>
							<div className="mt-8 flex items-center">
								<button
									type="button"
									onClick={addToCart}
									className="flex h-10 items-center justify-center rounded-sm border border-orange bg-orange/10 px-5 text-xs capitalize text-orange shadow-sm hover:bg-orange/5 sm:h-12 sm:text-base">
									<svg
										enableBackground="new 0 0 15 15"
										viewBox="0 0 15 15"
										x={0}
										y={0}
										className="mr-[10px] h-5 w-5 fill-current stroke-orange text-orange">
										<g>
											<g>
												<polyline
													fill="none"
													points=".5 .5 2.7 .5 5.2 11 12.4 11 14.5 3.5 3.7 3.5"
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeMiterlimit={10}
												/>
												<circle cx={6} cy="13.5" r={1} stroke="none" />
												<circle cx="11.5" cy="13.5" r={1} stroke="none" />
											</g>
											<line
												fill="none"
												strokeLinecap="round"
												strokeMiterlimit={10}
												x1="7.5"
												x2="10.5"
												y1={7}
												y2={7}
											/>
											<line
												fill="none"
												strokeLinecap="round"
												strokeMiterlimit={10}
												x1={9}
												x2={9}
												y1="8.5"
												y2="5.5"
											/>
										</g>
									</svg>
									thêm vào giỏ hàng
								</button>
								<button
									type="button"
									onClick={handleBuyNow}
									className="ml-4 flex h-10 min-w-[5rem] items-center justify-center rounded-sm bg-orange px-5 text-xs capitalize text-white shadow-sm outline-none hover:bg-orange/90 sm:h-12 sm:text-base">
									mua ngay
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="mt-8">
				<div className="container">
					<div className="mt-8 bg-white p-4 shadow">
						<div className="rounded bg-gray-50 p-4 text-lg uppercase text-slate-700">
							MÔ TẢ SẢN PHẨM
						</div>
						<div className="mx-4 mb-4 mt-10 text-sm leading-loose">
							<div
								dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.description) }}></div>
						</div>
					</div>
				</div>
			</div>
			<div className="mt-8">
				<div className="container">
					<div className="uppercase text-gray-500">CÓ THỂ BẠN CŨNG THÍCH</div>
					{productsData && (
						<div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
							{productsData.data.data.products.map((product) => (
								<div key={product._id} className="col-span-1">
									<Product product={product} />
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
