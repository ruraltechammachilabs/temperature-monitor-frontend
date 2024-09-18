import { lazy, Suspense } from "react";
import { Outlet, Navigate, useRoutes } from "react-router-dom";

import DashboardLayout from "../layouts/dashboard";
import AuthPage from "../layouts/Auth/AuthPage";
import PrivateRoute from "./PrivateRoute";

export const TemperatureDashboard = lazy(() => import("../pages/temperature-dashboard"));
export const Page404 = lazy(() => import("../pages/page-not-found"));

export const Router = () => {

	const routes = useRoutes([
		{
			path: '/',
			element: <Navigate to="/auth/login" replace />,
		},
		{
			path: '/dashboard',
			element: (
					<PrivateRoute>
						<DashboardLayout>
							<Suspense>
								<Outlet />
							</Suspense>
						</DashboardLayout>
					</PrivateRoute>
			),
			children: [
				{ element: <Navigate to="/dashboard/home" replace />, index: true },
				{ 
					path: "home", 
					element: <TemperatureDashboard />,
				},
				{ 
					path: "settings", 
					element: <TemperatureDashboard />,
				},
				{ 
					path: "alert-users", 
					element: <TemperatureDashboard />,
				},
				{ 
					path: "users", 
					element: <TemperatureDashboard />,
				},
				{ 
					path: "profile", 
					element: <TemperatureDashboard />,
				},
				
			],
			
		},
		{
			path: "/auth",
			element: <AuthPage />,
			children: [
				{ path: 'login', index: true },
				// { path: "login", element: <AuthPage /> },
				// { path: "register", element: <AuthPage /> },
			],
		},
		{
			path: "404",
			element: <Page404 />,
		},
		{
			path: "*",
			element: <Navigate to="/404" replace />,
		},
	]);

	return routes;
};
export default Router;
