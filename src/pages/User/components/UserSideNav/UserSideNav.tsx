import { Link, NavLink } from "react-router-dom";
import { useContext } from "react";

import path from "../../../../constants/path";
import { AppContext } from "../../../../contexts/app.context";
import { getAvatarUrl } from "../../../../utils/utils";
import classNames from "classnames";
import Avatar from "../../../../components/Avatar";

export default function UserSideNav() {
	const { profile } = useContext(AppContext);
	return (
		<div>
			<div className="flex items-center border-b border-b-gray-200 py-4">
				<Link
					to={path.profile}
					className="h-12 w-12 shrink-0 overflow-hidden rounded-full border border-black/10">
					<Avatar src={getAvatarUrl(profile?.avatar)} className="h-full w-full object-cover" />
				</Link>
				<div className="grow pl-4">
					<div
						className="mb-1 max-w-[120px] font-semibold text-gray-600 md:truncate"
						title={profile?.email}>
						{profile?.email}
					</div>
					<Link to={path.profile} className="flex items-center capitalize text-gray-500">
						<svg
							width={12}
							height={12}
							viewBox="0 0 12 12"
							xmlns="http://www.w3.org/2000/svg"
							style={{ marginRight: 4 }}>
							<path
								d="M8.54 0L6.987 1.56l3.46 3.48L12 3.48M0 8.52l.073 3.428L3.46 12l6.21-6.18-3.46-3.48"
								fill="#9B9B9B"
								fillRule="evenodd"
							/>
						</svg>
						Sửa Hồ Sơ
					</Link>
				</div>
			</div>
			<div className="mt-7 flex items-center overflow-x-auto md:flex-col md:items-start md:[&_a:first-child]:ml-0 md:[&_a:first-child]:mt-0 [&_a]:ml-4 md:[&_a]:ml-0 md:[&_a]:mt-4">
				<NavLink
					to={path.profile}
					className={({ isActive }) =>
						classNames("flex items-center capitalize transition-colors", {
							"text-orange": isActive,
							"text-gray-600": !isActive,
						})
					}>
					<div className="mr-3 h-[22px] w-[22px]">
						<img
							src="https://down-vn.img.susercontent.com/file/ba61750a46794d8847c3f463c5e71cc4"
							alt=""
							className="h-full w-full"
						/>
					</div>
					<p className="text-xs md:text-base">Tài khoản của tôi</p>
				</NavLink>
				<NavLink
					to={path.changePassword}
					className={({ isActive }) =>
						classNames("flex items-center capitalize transition-colors", {
							"text-orange": isActive,
							"text-gray-600": !isActive,
						})
					}>
					<div className="mr-3 h-[22px] w-[22px]">
						<img
							src="https://down-vn.img.susercontent.com/file/ba61750a46794d8847c3f463c5e71cc4"
							alt=""
							className="h-full w-full"
						/>
					</div>
					<p className="text-xs md:text-base">Đổi mật khẩu</p>
				</NavLink>
				<NavLink
					to={path.historyPurchase}
					className={({ isActive }) =>
						classNames("flex items-center capitalize transition-colors", {
							"text-orange": isActive,
							"text-gray-600": !isActive,
						})
					}>
					<div className="mr-3 h-[22px] w-[22px]">
						<img
							src="https://down-vn.img.susercontent.com/file/f0049e9df4e536bc3e7f140d071e9078"
							alt=""
							className="h-full w-full"
						/>
					</div>
					<p className="text-xs md:text-base">Đơn Mua</p>
				</NavLink>
			</div>
		</div>
	);
}
