export default function PageLoading() {
	return (
		<div className="h-screen">
			<div className="flex h-full w-full items-center justify-center">
				<svg width={34} height={12} viewBox="-1 0 33 12">
					<circle
						className="animate-[wiggle_0.4s_linear_infinite]"
						cx={4}
						cy={6}
						r={4}
						fill="#EE4D2D"
					/>
					<circle
						className="animate-[wiggle_0.4s_0.1s_linear_infinite]"
						cx={16}
						cy={6}
						r={4}
						fill="#EE4D2D"
					/>
					<circle
						className="animate-[wiggle_0.4s_0.2s_linear_infinite]"
						cx={28}
						cy={6}
						r={4}
						fill="#EE4D2D"
					/>
				</svg>
			</div>
		</div>
	);
}
