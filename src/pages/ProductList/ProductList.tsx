import { Helmet } from "react-helmet-async";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import AsideFilter from "./components/AsideFilter";
import Product from "./components/Product";
import SortProductList from "./components/SortProductList";
import productApi from "../../apis/product.api";
import Pagination from "../../components/Pagination";
import { ProductListConfig } from "../../types/product.type";
import useQueryConfig from "../../hooks/useQueryConfig";
import ProductSkeleton from "./components/Product/ProductSkeleton";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import path from "../../constants/path";
import MobileFilter from "./components/MobileFilter";

const NoProductFound = () => {
	const navigate = useNavigate();
	const handleClearFilter = () => {
		navigate({
			pathname: path.home,
		});
	};
	return (
		<section>
			<div className="my-20 flex flex-col items-center justify-center">
				<img src="/public/images/no-product-found.png" alt="not-found" className="h-32 w-32" />
				<div className="text-gray-400">
					Không có sản phẩm nào. Bạn thử tắt điều kiện lọc và tìm lại nhé?
				</div>
				<div className="mt-2 text-gray-400">or</div>
				<div className="mt-2">
					<button
						type="button"
						onClick={handleClearFilter}
						className="rounded-sm bg-orange px-5 py-4 font-light text-white">
						Xóa bộ lọc
					</button>
				</div>
			</div>
		</section>
	);
};

export default function ProductList() {
	const queryConfig = useQueryConfig();
	const { data: productsData, isLoading } = useQuery({
		queryKey: ["products", queryConfig],
		queryFn: () => {
			return productApi.getProducts(queryConfig as ProductListConfig);
		},
		placeholderData: keepPreviousData,
		staleTime: 3 * 1000 * 60,
	});

	return (
		<div className="bg-gray-100 py-6">
			<Helmet>
				<title>Shopee</title>
				<meta name="description" content="Shopee - danh sách sản phẩm" />
			</Helmet>
			<div className="container">
				<div className="grid grid-cols-12 gap-6">
					<div className="col-span-4 hidden sm:col-span-4 sm:block md:col-span-3">
						<AsideFilter />
					</div>
					{productsData && (
						<div className="col-span-12 sm:col-span-8 md:col-span-9">
							{productsData.data.data.products.length > 0 ? (
								<Fragment>
									<SortProductList
										queryConfig={queryConfig}
										pageSize={productsData.data.data.pagination.page_size}
									/>
									<MobileFilter />
									<div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
										{productsData.data.data.products.map((product) => (
											<div key={product._id} className="col-span-1">
												<Product product={product} />
											</div>
										))}
									</div>
									<Pagination
										queryConfig={queryConfig}
										pageSize={productsData.data.data.pagination.page_size}
									/>
								</Fragment>
							) : (
								<NoProductFound />
							)}
						</div>
					)}
					{!productsData && isLoading && (
						<div className="col-span-12 animate-pulse md:col-span-9">
							<div className="h-14 w-full rounded bg-gray-100"></div>
							<div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
								{Array(10)
									.fill(0)
									.map((_, index) => (
										<ProductSkeleton key={index} />
									))}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
