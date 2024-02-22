import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useContext } from "react";

import Popover from "../../../../components/Popover";
import { AppContext } from "../../../../contexts/app.context";
import path from "../../../../constants/path";
import authApi from "../../../../apis/auth.api";
import { purchasesStatus } from "../../../../constants/purchase";
import { getAvatarUrl } from "../../../../utils/utils";
import { clearLS } from "../../../../utils/auth";
import LanguageSwitcher from "../LanguageSwitcher";

export default function NavHeader() {
	const { isAuthenticated, profile } = useContext(AppContext);
	const queryClient = useQueryClient();

	const logoutMutation = useMutation({
		mutationFn: authApi.logout,
		onSuccess: () => {
			queryClient.removeQueries({ queryKey: ["purchases", { status: purchasesStatus.inCart }] });
			clearLS();
		},
	});

	const handleLogout = () => {
		logoutMutation.mutate();
	};

	return (
		<div className="hidden justify-end pt-2 sm:flex">
			<LanguageSwitcher />
			{isAuthenticated && (
				<Popover
					className="ml-6 flex items-end py-1 text-white hover:text-gray-200"
					renderPopover={
						<div className="rounded-sm text-black shadow-md">
							<Link
								to={path.profile}
								className="block w-full bg-white px-4 py-3 text-left hover:bg-slate-100 hover:text-cyan-500">
								Tài khoản của tôi
							</Link>
							<Link
								to={path.historyPurchase}
								className="block w-full bg-white px-4 py-3 text-left hover:bg-slate-100 hover:text-cyan-500">
								Đơn mua
							</Link>
							<button
								type="button"
								onClick={handleLogout}
								className="block w-full bg-white px-4 py-3 text-left hover:bg-slate-100 hover:text-cyan-500">
								Đăng xuất
							</button>
						</div>
					}>
					<div className="mr-2 h-6 w-6 flex-shrink-0">
						<img
							src={getAvatarUrl(profile?.avatar)}
							onError={(evt) => {
								evt.currentTarget.src = "/images/default-avatar.jpg";
							}}
							alt="avatar"
							className="h-full w-full rounded-full bg-white object-cover"
						/>
					</div>
					<div className="max-w-[8rem] truncate">{profile?.email}</div>
				</Popover>
			)}
			{!isAuthenticated && (
				<div className="flex items-center text-sm sm:text-base">
					<Link to={path.register} className="mx-3 capitalize hover:text-gray-200">
						Đăng ký
					</Link>
					<div className="h-3 border-r-[1px] border-r-white/40"></div>
					<Link to={path.login} className="mx-3 capitalize hover:text-gray-200">
						Đăng nhập
					</Link>
				</div>
			)}
		</div>
	);
}
