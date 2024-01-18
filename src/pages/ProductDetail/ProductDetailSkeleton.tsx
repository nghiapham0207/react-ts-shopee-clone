export default function ProductDetailSkeleton() {
	return (
		<div className="bg-gray-200 py-6">
			<div className="container">
				<div className="bg-white p-4 shadow">
					<div className="grid animate-pulse grid-cols-12 gap-9">
						<div className="col-span-5 bg-slate-200">
							<div className="relative h-full w-full overflow-hidden pt-[100%] shadow">
								<div className="absolute left-0 top-0 flex h-full w-full items-center justify-center">
									<svg
										className="h-20 w-20 text-slate-200 dark:text-slate-400"
										aria-hidden="true"
										xmlns="http://www.w3.org/2000/svg"
										fill="currentColor"
										viewBox="0 0 16 20">
										<path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
										<path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
									</svg>
								</div>
							</div>
						</div>
						<div className="col-span-7">
							<h1 className="h-8 rounded bg-slate-200"></h1>
							<div className="mt-3 flex items-center">
								<div className="h-6 w-1/2 rounded bg-slate-200"></div>
							</div>
							<div className="mt-8 flex h-6 w-full items-center rounded bg-slate-200 px-5 py-4"></div>
							<div className="mt-8 flex items-center">
								<div className="h-6 w-1/2 rounded bg-slate-200"></div>
								<div className="ml-6 text-sm text-gray-500"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
