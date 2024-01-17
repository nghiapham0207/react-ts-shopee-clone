import CartHeader from "../../components/CartHeader";
import Footer from "../Footer";

interface Props {
	children?: React.ReactNode;
}

export default function CartLayout({ children }: Props) {
	return (
		<div>
			<CartHeader />
			{children}
			<Footer />
		</div>
	);
}
