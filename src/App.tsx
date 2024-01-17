import { ToastContainer } from "react-toastify";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useContext, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";

import useRouteElements from "./hooks/useRouteElements";
import { AppProvider } from "./contexts/app.context";
import ErrorBoundary from "./components/ErrorBoundary";
import { LocalStorageEventTarget } from "./utils/auth";
import { AppContext } from "./contexts/app.context";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			retry: 0,
		},
	},
});

function App() {
	const routeElements = useRouteElements();
	const { reset } = useContext(AppContext);
	useEffect(() => {
		LocalStorageEventTarget.addEventListener("clearLS", reset);
		return () => {
			LocalStorageEventTarget.removeEventListener("clearLS", reset);
		};
	}, [reset]);
	return (
		<HelmetProvider>
			<QueryClientProvider client={queryClient}>
				<AppProvider>
					<ErrorBoundary>
						<div>
							{routeElements}
							<ToastContainer />
						</div>
					</ErrorBoundary>
				</AppProvider>
				<ReactQueryDevtools initialIsOpen={false} />
			</QueryClientProvider>
		</HelmetProvider>
	);
}

export default App;
