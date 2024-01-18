import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";

import Input from "../../components/Input";
import authApi from "../../apis/auth.api";
import { yupResolver } from "@hookform/resolvers/yup";
import { Schema, schema } from "../../utils/rules";
import { isAxiosUnprocessableEntityError } from "../../utils/utils";
import { ErrorResponse } from "../../types/utils.type";
import { AppContext } from "../../contexts/app.context";
import Button from "../../components/Button";

type FormData = Pick<Schema, "email" | "password">;
const loginSchema = schema.pick(["email", "password"]);

export default function Login() {
	const { setIsAuthenticated, setProfile } = useContext(AppContext);
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm<FormData>({
		resolver: yupResolver(loginSchema),
	});
	const loginMutation = useMutation({
		mutationFn: (body: Omit<FormData, "confirm_password">) => authApi.login(body),
	});
	const onSubmit = handleSubmit((data) => {
		loginMutation.mutate(data, {
			onSuccess: (data) => {
				setIsAuthenticated(true);
				setProfile(data.data.data.user);
				navigate("/");
			},
			onError: (error) => {
				console.log(error);
				if (
					isAxiosUnprocessableEntityError<ErrorResponse<Omit<FormData, "confirm_password">>>(error)
				) {
					const formError = error.response?.data.data;
					if (formError) {
						Object.keys(formError).forEach((key) => {
							setError(key as keyof Omit<FormData, "confirm_password">, {
								message: formError[key as keyof Omit<FormData, "confirm_password">],
								type: "Server",
							});
						});
					}
				}
			},
		});
	});
	return (
		<div className="bg-orange">
			<Helmet>
				<title>Shopee - Đăng nhập</title>
				<meta name="description" content="Shopee - Đăng nhập" />
			</Helmet>
			<div className="container">
				<div className="grid grid-cols-1 py-6 lg:grid-cols-5 lg:py-12 lg:pr-10">
					<div className="lg:col-span-2 lg:col-start-4">
						<form className="rounded bg-white p-10 shadow-sm" onSubmit={onSubmit} noValidate>
							<div className="text-2xl">Đăng nhập</div>
							<Input
								name="email"
								type="email"
								register={register}
								className="mt-8"
								placeholder="Email"
								errorMessage={errors.email?.message}
							/>
							<Input
								name="password"
								type="password"
								register={register}
								className="mt-3"
								placeholder="Password"
								// rules={rules.password}
								errorMessage={errors.password?.message}
							/>
							<div className="mt-3">
								<Button
									type="submit"
									isLoading={loginMutation.isPending}
									disabled={loginMutation.isPending}
									className="flex w-full items-center justify-center rounded bg-red-500 px-2 py-4 text-sm uppercase text-white hover:bg-red-600">
									Đăng nhập
								</Button>
							</div>
							<div className="mt-8 flex items-center justify-center">
								<span className="text-gray-300">Bạn chưa có tài khoản?</span>
								<Link to="/register" className="ml-2 text-red-400">
									Đăng ký
								</Link>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}
