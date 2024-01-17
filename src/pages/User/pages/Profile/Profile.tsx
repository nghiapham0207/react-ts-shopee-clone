import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, FormProvider, useForm, useFormContext } from "react-hook-form";
import { Fragment, useContext, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import Button from "../../../../components/Button";
import Input from "../../../../components/Input";
import userApi from "../../../../apis/user.api";
import { UserSchema, userSchema } from "../../../../utils/rules";
import InputNumber from "../../../../components/InputNumber";
import DateSelection from "../../components/DateSelection";
import { AppContext } from "../../../../contexts/app.context";
import { setProfileToLS } from "../../../../utils/auth";
import { getAvatarUrl, isAxiosUnprocessableEntityError } from "../../../../utils/utils";
import { ErrorResponse } from "../../../../types/utils.type";
import InputFile from "../../../../components/InputFile";

type FormData = Pick<UserSchema, "name" | "avatar" | "phone" | "date_of_birth" | "address">;
type FormDataError = Omit<FormData, "date_of_birth"> & { date_of_birth?: string };
const profileSchema = userSchema.pick(["name", "address", "avatar", "phone", "date_of_birth"]);

function Infor() {
	const {
		register,
		control,
		formState: { errors },
	} = useFormContext<FormData>();
	return (
		<Fragment>
			<div className="mt-6 flex flex-wrap sm:flex-row">
				<div className="truncate pt-3 capitalize sm:w-[20%] sm:text-right">Tên</div>
				<div className="sm:w-[80%] sm:pl-5">
					<Input
						register={register}
						name="name"
						placeholder="Tên"
						errorMessage={errors.name?.message}
						className="mt-1"
						classNameInput="w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm"
					/>
				</div>
			</div>
			<div className="mt-2 flex flex-wrap sm:flex-row">
				<div className="truncate pt-3 capitalize sm:w-[20%] sm:text-right">Số điện thoại</div>
				<div className="sm:w-[80%] sm:pl-5">
					<Controller
						control={control}
						name="phone"
						render={({ field }) => (
							<InputNumber
								placeholder="Số điện thoại"
								errorMessage={errors.phone?.message}
								className="mt-1"
								classNameInput="w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm"
								{...field}
								onChange={field.onChange}
							/>
						)}
					/>
				</div>
			</div>
		</Fragment>
	);
}

export default function Profile() {
	const [file, setFile] = useState<File>();
	const previewImage = useMemo(() => {
		return file ? URL.createObjectURL(file) : "";
	}, [file]);
	const { setProfile } = useContext(AppContext);
	const { data: profileData, refetch } = useQuery({
		queryKey: ["profile"],
		queryFn: userApi.getProfile,
	});
	const profile = profileData?.data.data;
	const updateProfileMutation = useMutation({
		mutationFn: userApi.updateProfile,
	});
	const uploadAvatarMutation = useMutation({
		mutationFn: userApi.uploadAvatar,
	});
	const methods = useForm<FormData>({
		defaultValues: {
			name: "",
			address: "",
			avatar: "",
			phone: "",
			date_of_birth: new Date(1910, 0, 1),
		},
		resolver: yupResolver(profileSchema),
	});
	const {
		register,
		control,
		formState: { errors },
		handleSubmit,
		watch,
		setValue,
		setError,
	} = methods;
	const avatar = watch("avatar");

	useEffect(() => {
		if (profile) {
			setValue("name", profile.name);
			setValue("phone", profile.phone);
			setValue("address", profile.address);
			setValue("avatar", profile.avatar);
			setValue(
				"date_of_birth",
				profile.date_of_birth ? new Date(profile.date_of_birth) : new Date(1910, 0, 1),
			);
		}
	}, [profile, setValue]);

	const onSubmit = handleSubmit(async (data) => {
		try {
			let avatarName = avatar;
			if (file) {
				const form = new FormData();
				form.append("image", file);
				const uploadRes = await uploadAvatarMutation.mutateAsync(form);
				avatarName = uploadRes.data.data;
				setValue("avatar", avatarName);
			}
			const res = await updateProfileMutation.mutateAsync({
				...data,
				date_of_birth: data.date_of_birth?.toISOString(),
				avatar: avatarName,
			});
			refetch();
			toast.success(res.data.message);
			setProfile(res.data.data);
			setProfileToLS(res.data.data);
		} catch (error) {
			if (isAxiosUnprocessableEntityError<ErrorResponse<FormDataError>>(error)) {
				const formError = error.response?.data.data;
				if (formError) {
					Object.keys(formError).forEach((key) => {
						setError(key as keyof FormDataError, {
							message: formError[key as keyof FormDataError],
							type: "Server",
						});
					});
				}
			}
		}
	});
	const handleChangeFile = (file?: File) => {
		setFile(file);
	};

	return (
		<div className="rounded-sm bg-white px-2 pb-10 shadow md:px-7 md:pb-20">
			<div className="border-b border-b-gray-200 py-6">
				<h1 className="text-lg font-medium capitalize text-gray-900">Hồ Sơ Của Tôi</h1>
				<div className="mt-1 text-sm text-gray-700">
					Quản lý thông tin hồ sơ để bảo mật tài khoản
				</div>
			</div>
			<FormProvider {...methods}>
				<form onSubmit={onSubmit} className="mt-8 flex flex-col-reverse md:flex-row md:items-start">
					<div className="mt-6 grow md:mt-0 md:pr-12">
						<div className="flex flex-wrap sm:flex-row">
							<div className="truncate pt-3 capitalize sm:w-[20%] sm:text-right">Email</div>
							<div className="sm:w-[80%] sm:pl-5">
								<div className="pt-3 text-gray-700">{profile?.email}</div>
							</div>
						</div>
						<Infor />
						<div className="mt-2 flex flex-wrap sm:flex-row">
							<div className="truncate pt-3 capitalize sm:w-[20%] sm:text-right">Địa chỉ</div>
							<div className="sm:w-[80%] sm:pl-5">
								<Input
									register={register}
									name="address"
									placeholder="Địa chỉ"
									errorMessage={errors.address?.message}
									className="mt-1"
									classNameInput="w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm"
								/>
							</div>
						</div>
						<Controller
							control={control}
							name="date_of_birth"
							render={({ field }) => (
								<DateSelection
									errorMessage={errors.date_of_birth?.message}
									onChange={field.onChange}
									value={field.value}
								/>
							)}
						/>
						<div className="mt-2 flex flex-wrap sm:flex-row">
							<div className="truncate pt-3 capitalize sm:w-[20%] sm:text-right"></div>
							<div className="sm:w-[80%] sm:pl-5">
								<Button
									type="submit"
									className="flex h-9 items-center rounded-sm bg-orange px-5 text-center text-sm text-white hover:bg-orange/80">
									Lưu
								</Button>
							</div>
						</div>
					</div>
					<div className="flex justify-center  md:w-72 md:border-l md:border-l-gray-200">
						<div className="flex flex-col items-center">
							<div className="my-5 h-24 w-24">
								<img
									src={previewImage || getAvatarUrl(avatar)}
									alt=""
									className="h-full w-full rounded-full object-cover"
								/>
							</div>
							<InputFile onChange={handleChangeFile} />
							<div className="mt-3 text-gray-400">
								<div>Dụng lượng file tối đa 1 MB</div>
								<div>Định dạng:.JPEG, .PNG</div>
							</div>
						</div>
					</div>
				</form>
			</FormProvider>
		</div>
	);
}
