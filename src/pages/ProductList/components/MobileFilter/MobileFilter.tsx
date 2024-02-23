import { Fragment } from "react";
import AsideFilter from "../AsideFilter";
import useShowModal from "../../../../hooks/useShowModal";

export default function MobileFilter() {
	const [showMobileFilter, handleShowMobileFilter] = useShowModal();
	return (
		<Fragment>
			{showMobileFilter && (
				<div className="visible fixed inset-0 z-50 h-screen w-screen overflow-y-auto bg-white sm:hidden">
					<div className="p-4">
						<div className="flex justify-end">
							<button
								type="button"
								onClick={() => {
									handleShowMobileFilter(false);
								}}>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									className="h-6 w-6">
									<path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
								</svg>
							</button>
						</div>
						<AsideFilter />
					</div>
				</div>
			)}
			<button
				type="button"
				onClick={() => {
					handleShowMobileFilter(true);
				}}
				className="mt-3 flex w-full cursor-pointer items-center justify-center rounded bg-gray-200 py-2 hover:bg-orange/10 active:bg-orange active:text-white sm:hidden">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className="mx-2 h-5 w-5">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
					/>
				</svg>
				<span>Bộ lọc</span>
			</button>
		</Fragment>
	);
}
