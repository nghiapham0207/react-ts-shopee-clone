import { ToastContainer } from "react-toastify";
import { useContext, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";

import useRouteElements from "./hooks/useRouteElements";
import { LocalStorageEventTarget } from "./utils/auth";
import { AppContext } from "./contexts/app.context";

function App() {
	const routeElements = useRouteElements();
	const { reset } = useContext(AppContext);

	useEffect(() => {
		console.log("App");
		LocalStorageEventTarget.addEventListener("clearLS", reset);
		return () => {
			console.log("Clean App");

			LocalStorageEventTarget.removeEventListener("clearLS", reset);
		};
	}, [reset]);
	return (
		<div>
			{routeElements}
			<ToastContainer />
		</div>
	);
}

export default App;
