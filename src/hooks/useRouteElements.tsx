import { Navigate, Outlet, useRoutes } from "react-router-dom";
import { Suspense, lazy, useContext } from "react";

import RegisterLayout from "../layouts/RegisterLayout";
import MainLayout from "../layouts/MainLayout";
import { AppContext } from "../contexts/app.context";
import path from "../constants/path";
import CartLayout from "../layouts/CartLayout";
import UserLayout from "../pages/User/layouts/UserLayout";

// eslint-disable-next-line react-refresh/only-export-components
const Login = lazy(() => import("../pages/Login"));
// eslint-disable-next-line react-refresh/only-export-components
const ProductList = lazy(() => import("../pages/ProductList"));
// eslint-disable-next-line react-refresh/only-export-components
const Register = lazy(() => import("../pages/Register"));
// eslint-disable-next-line react-refresh/only-export-components
const Profile = lazy(() => import("../pages/User/pages/Profile"));
// eslint-disable-next-line react-refresh/only-export-components
const ProductDetail = lazy(() => import("../pages/ProductDetail"));
// eslint-disable-next-line react-refresh/only-export-components
const Cart = lazy(() => import("../pages/Cart"));
// eslint-disable-next-line react-refresh/only-export-components
const ChangePassword = lazy(() => import("../pages/User/pages/ChangePassword"));
// eslint-disable-next-line react-refresh/only-export-components
const HistoryPurchase = lazy(() => import("../pages/User/pages/HistoryPurchase"));
// eslint-disable-next-line react-refresh/only-export-components
const NotFound = lazy(() => import("../pages/NotFound"));

// eslint-disable-next-line react-refresh/only-export-components
function ProtectedRoute() {
	const { isAuthenticated } = useContext(AppContext);
	return isAuthenticated ? <Outlet /> : <Navigate to={path.login} />;
}

// eslint-disable-next-line react-refresh/only-export-components
function RejectedRoute() {
	const { isAuthenticated } = useContext(AppContext);
	return !isAuthenticated ? <Outlet /> : <Navigate to="/" />;
}

export default function useRouteElements() {
	const routeElements = useRoutes([
		{
			path: "",
			index: true,
			element: (
				<MainLayout>
					<Suspense fallback={<div>loading...</div>}>
						<ProductList />
					</Suspense>
				</MainLayout>
			),
		},
		{
			path: path.productDetail,
			element: (
				<MainLayout>
					<Suspense fallback={<div>loading...</div>}>
						<ProductDetail />
					</Suspense>
				</MainLayout>
			),
		},
		{
			path: "",
			element: <ProtectedRoute />,
			children: [
				{
					path: path.cart,
					element: (
						<CartLayout>
							<Suspense fallback={<div>loading...</div>}>
								<Cart />
							</Suspense>
						</CartLayout>
					),
				},
				{
					path: path.user,
					element: (
						<MainLayout>
							<UserLayout />
						</MainLayout>
					),
					children: [
						{
							path: path.profile,
							element: (
								<Suspense fallback={<div>loading...</div>}>
									<Profile />
								</Suspense>
							),
						},
						{
							path: path.changePassword,
							element: (
								<Suspense fallback={<div>loading...</div>}>
									<ChangePassword />
								</Suspense>
							),
						},
						{
							path: path.historyPurchase,
							element: (
								<Suspense fallback={<div>loading...</div>}>
									<HistoryPurchase />
								</Suspense>
							),
						},
					],
				},
			],
		},
		{
			path: "",
			element: <RejectedRoute />,
			children: [
				{
					path: path.login,
					element: (
						<RegisterLayout>
							<Suspense fallback={<div>loading...</div>}>
								<Login />
							</Suspense>
						</RegisterLayout>
					),
				},
				{
					path: path.register,
					element: (
						<RegisterLayout>
							<Suspense fallback={<div>loading...</div>}>
								<Register />
							</Suspense>
						</RegisterLayout>
					),
				},
			],
		},
		{
			path: "*",
			element: (
				<MainLayout>
					<Suspense fallback={<div>loading...</div>}>
						<NotFound />
					</Suspense>
				</MainLayout>
			),
		},
	]);
	return routeElements;
}
