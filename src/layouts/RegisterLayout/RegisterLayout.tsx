import Footer from "../Footer";
import RegisterHeader from "../RegisterHeader";

interface Props {
	children?: React.ReactNode;
}

export default function RegisterLayout({ children }: Props) {
	return (
		<div>
			<RegisterHeader />
			{children}
			<Footer />
		</div>
	);
}
