import { Fragment } from "react";
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
import MobileFilter from "./components/MobileFilter";
import NoProductsFound from "./components/NoProductsFound";

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
								<NoProductsFound />
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
