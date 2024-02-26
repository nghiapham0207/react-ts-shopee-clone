import { useState } from "react";

export default function useShowModal(): [boolean, (isShow: boolean) => void] {
	const [showModal, setShowModal] = useState(false);

	const handleShowModal = (isShow: boolean) => {
		const body = document.body;
		if (isShow) {
			body.style.height = "100vh";
			body.style.overflowY = "hidden";
		} else {
			body.style.height = "";
			body.style.overflowY = "";
		}
		setShowModal(isShow);
	};
	// tupple type
	return [showModal, handleShowModal];
}
