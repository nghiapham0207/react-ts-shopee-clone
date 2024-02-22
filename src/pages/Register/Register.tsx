import { Helmet } from "react-helmet-async";
import omit from "lodash/omit";
import { useMutation } from "@tanstack/react-query";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useContext } from "react";

import { getRules, schema, Schema } from "../../utils/rules";
import Input from "../../components/Input";
import authApi from "../../apis/auth.api";
import { isAxiosUnprocessableEntityError } from "../../utils/utils";
import { ErrorResponse } from "../../types/utils.type";
import { AppContext } from "../../contexts/app.context";
import Button from "../../components/Button";

// type FormData = Schema;
type FormData = Pick<Schema, "email" | "password" | "confirm_password">;
const registerSchema = schema.pick(["email", "password", "confirm_password"]);

const MAX_LEN_EMAIL = 60;
const MAX_LEN_PASSWORD = 160;

export default function Register() {
	const { setIsAuthenticated, setProfile } = useContext(AppContext);
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		getValues,
		setError,
		formState: { errors },
	} = useForm<FormData>({
		resolver: yupResolver(registerSchema),
	});
	const rules = getRules(getValues);
	console.log("rules", rules);

	const registerAccountMutation = useMutation({
		mutationFn: (body: Omit<FormData, "confirm_password">) => authApi.registerAccount(body),
	});
	const onSubmit = handleSubmit((data) => {
		const body = omit(data, ["confirm_password"]);
		registerAccountMutation.mutate(body, {
			onSuccess: (data) => {
				setIsAuthenticated(true);
				setProfile(data.data.data.user);
				navigate("/");
			},
			onError: (error) => {
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
				<title>Shopee - Đăng ký</title>
				<meta name="description" content="Shopee - Đăng ký" />
			</Helmet>
			<div className="container">
				<div className="grid grid-cols-1 py-6 lg:grid-cols-5 lg:py-12 lg:pr-10">
					<div className="lg:col-span-2 lg:col-start-4">
						<form className="rounded bg-white p-10 shadow-sm" onSubmit={onSubmit} noValidate>
							<div className="text-2xl">Đăng ký</div>
							<Input
								name="email"
								type="email"
								maxLength={MAX_LEN_EMAIL}
								register={register}
								className="mt-8"
								placeholder="Email"
								// rules={rules.email}
								errorMessage={errors.email?.message}
							/>
							<Input
								name="password"
								type="password"
								maxLength={MAX_LEN_PASSWORD}
								register={register}
								className="mt-2"
								placeholder="Password"
								// rules={rules.password}
								errorMessage={errors.password?.message}
							/>
							<Input
								name="confirm_password"
								type="password"
								maxLength={MAX_LEN_PASSWORD}
								register={register}
								className="mt-2"
								placeholder="Confirm password"
								// rules={rules.confirm_password}
								errorMessage={errors.confirm_password?.message}
							/>
							<div className="mt-2">
								<Button
									isLoading={registerAccountMutation.isPending}
									disabled={registerAccountMutation.isPending}
									className="flex w-full items-center justify-center rounded bg-red-500 px-2 py-4 text-sm uppercase text-white hover:bg-red-600">
									Đăng ký
								</Button>
							</div>
							<div className="mt-8 flex items-center justify-center">
								<span className="text-gray-300">Bạn đã có tài khoản?</span>
								<Link to="/login" className="ml-2 text-red-400">
									Đăng nhập
								</Link>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}
