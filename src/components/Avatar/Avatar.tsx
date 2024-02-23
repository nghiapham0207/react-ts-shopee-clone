interface Props {
	className?: string;
	src: string;
}

export default function Avatar({
	src,
	className = "h-full w-full rounded-full object-cover border",
}: Props) {
	return (
		<img
			src={src}
			onError={(evt) => {
				evt.currentTarget.src = "/images/default-avatar.jpg";
			}}
			alt="avatar"
			className={className}
		/>
	);
}
