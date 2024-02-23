import { Outlet } from "react-router-dom";
import UserSideNav from "../../components/UserSideNav";

export default function UserLayout() {
	return (
		<div className="bg-neutral-100 pb-10 pt-6 text-sm text-gray-600">
			<div className="container">
				<div className="grid grid-cols-1 gap-6 md:grid-cols-12">
					<div className="md:col-span-3 lg:col-span-3">
						<UserSideNav />
					</div>
					<div className="md:col-span-9 lg:col-span-9">
						<Outlet />
					</div>
				</div>
			</div>
		</div>
	);
}
