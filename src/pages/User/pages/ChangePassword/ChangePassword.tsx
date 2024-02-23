import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import Button from "../../../../components/Button";
import Input from "../../../../components/Input";
import { UserSchema, userSchema } from "../../../../utils/rules";
import userApi from "../../../../apis/user.api";
import { isAxiosUnprocessableEntityError } from "../../../../utils/utils";
import { ErrorResponse } from "../../../../types/utils.type";

type FormData = Pick<UserSchema, "password" | "new_password" | "confirm_password">;
const changePasswordSchema = userSchema.pick(["password", "new_password", "confirm_password"]);

export default function ChangePassword() {
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setError,
	} = useForm<FormData>({
		defaultValues: {
			password: "",
			new_password: "",
			confirm_password: "",
		},
		resolver: yupResolver(changePasswordSchema),
	});
	const changePasswordMutation = useMutation({
		mutationFn: userApi.updateProfile,
	});

	const onSubmit = handleSubmit(async (data) => {
		try {
			const res = await changePasswordMutation.mutateAsync({
				password: data.password as string,
				new_password: data.new_password as string,
			});
			reset();
			toast.success(res.data.message);
		} catch (error) {
			if (isAxiosUnprocessableEntityError<ErrorResponse<FormData>>(error)) {
				const formError = error.response?.data.data;
				if (formError) {
					Object.keys(formError).forEach((key) => {
						setError(key as keyof FormData, {
							message: formError[key as keyof FormData] as string,
							type: "Server",
						});
					});
				}
			}
		}
	});
	return (
		<div className="rounded-sm bg-white px-2 pb-10 shadow md:px-7 md:pb-20">
			<div className="border-b border-b-gray-200 py-6">
				<h1 className="text-lg font-medium capitalize text-gray-900">Đổi mật khẩu</h1>
				<div className="mt-1 text-sm text-gray-700">
					Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác
				</div>
			</div>
			<form onSubmit={onSubmit} className="mr-auto mt-8 max-w-2xl">
				<div className="mt-6 grow md:mt-0 md:pr-12">
					<div className="mt-2 flex flex-col flex-wrap sm:flex-row">
						<div className="truncate pt-3 capitalize sm:w-[30%] sm:text-right">Mật khẩu cũ</div>
						<div className="sm:w-[70%] sm:pl-5">
							<Input
								register={register}
								name="password"
								type="password"
								placeholder="Mật khẩu cũ"
								errorMessage={errors.password?.message}
								className="mt-1"
								classNameInput="w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm"
							/>
						</div>
					</div>
					<div className="mt-2 flex flex-col flex-wrap sm:flex-row">
						<div className="truncate pt-3 capitalize sm:w-[30%] sm:text-right">Mật khẩu mới</div>
						<div className="sm:w-[70%] sm:pl-5">
							<Input
								register={register}
								name="new_password"
								type="password"
								placeholder="Mật khẩu mới"
								errorMessage={errors.new_password?.message}
								className="mt-1"
								classNameInput="w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm"
							/>
						</div>
					</div>
					<div className="mt-2 flex flex-col flex-wrap sm:flex-row">
						<div className="truncate pt-3 capitalize sm:w-[30%] sm:text-right">
							Xác nhận mật khẩu mới
						</div>
						<div className="sm:w-[70%] sm:pl-5">
							<Input
								register={register}
								name="confirm_password"
								type="password"
								placeholder="Xác nhận mật khẩu mới"
								errorMessage={errors.confirm_password?.message}
								className="mt-1"
								classNameInput="w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm"
							/>
						</div>
					</div>
					<div className="mt-2 flex flex-col flex-wrap sm:flex-row">
						<div className="truncate pt-3 capitalize sm:w-[30%] sm:text-right"></div>
						<div className="sm:w-[70%] sm:pl-5">
							<Button
								type="submit"
								className="flex h-9 items-center rounded-sm bg-orange px-5 text-center text-sm text-white hover:bg-orange/80">
								Lưu
							</Button>
						</div>
					</div>
				</div>
			</form>
		</div>
	);
}
