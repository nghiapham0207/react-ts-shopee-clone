import { useNavigate } from "react-router-dom";

import path from "../../../../constants/path";

export const NoProductsFound = () => {
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
