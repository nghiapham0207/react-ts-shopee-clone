import { type RegisterOptions, type UseFormGetValues } from "react-hook-form";
import * as yup from "yup";

type Rules = {
	[key in "email" | "password" | "confirm_password"]?: RegisterOptions;
};

export const getRules = (
	getValues?: UseFormGetValues<{
		email: string;
		password: string;
		confirm_password: string;
	}>,
): Rules => ({
	email: {
		required: "Email là bắt buộc!",
		pattern: {
			value: /^\S+@\S+\.\S+$/,
			message: "Email không đúng định dạng!",
		},
		minLength: {
			value: 5,
			message: "Độ dài từ 5 - 60 ký tự!",
		},
		maxLength: {
			value: 60,
			message: "Độ dài từ 5 - 60 ký tự!",
		},
	},
	password: {
		required: "Password là bắt buộc!",
		minLength: {
			value: 6,
			message: "Độ dài từ 6 - 160 ký tự!",
		},
		maxLength: {
			value: 160,
			message: "Độ dài từ 6 - 160 ký tự!",
		},
	},
	confirm_password: {
		required: "Confrim password là bắt buộc!",
		minLength: {
			value: 6,
			message: "Độ dài từ 6 - 160 ký tự!",
		},
		maxLength: {
			value: 160,
			message: "Độ dài từ 6 - 160 ký tự!",
		},
		validate:
			typeof getValues === "function"
				? (value) => value === getValues("password") || "Confirm password không khớp!"
				: undefined,
	},
});

function testPriceRange(this: yup.TestContext<yup.AnyObject>) {
	const { price_min, price_max } = this.parent as { price_min: string; price_max: string };
	if (price_min !== "" && price_max !== "") {
		return Number(price_max) >= Number(price_min);
	}
	return price_min !== "" || price_max !== "";
}

const handleConfirmPasswordYup = (refString: string) => {
	return yup
		.string()
		.required("Nhập lại password là bắt buộc")
		.min(6, "Độ dài từ 6 - 160 ký tự")
		.max(160, "Độ dài từ 6 - 160 ký tự")
		.oneOf([yup.ref(refString)], "Nhập lại password không khớp");
};

export const schema = yup
	.object({
		email: yup
			.string()
			.required("Email là bắt buộc!")
			.min(5, "Độ dài từ 5 - 60 ký tự!")
			.max(60, "Độ dài từ 5 - 60 ký tự!")
			.email("Email không đúng định dạng!"),
		password: yup
			.string()
			.required("Password là bắt buộc!")
			.min(6, "Độ dài từ 6 - 160 ký tự!")
			.max(160, "Độ dài từ 6 - 160 ký tự!"),
		confirm_password: handleConfirmPasswordYup("password"),
		price_min: yup.string().test({
			name: "price-not-allowed",
			message: "Giá cả không phù hợp",
			test: testPriceRange,
		}),
		price_max: yup.string().test({
			name: "price-not-allowed",
			message: "Giá cả không phù hợp",
			test: testPriceRange,
		}),
		name: yup.string().trim().required("Tên sản phẩm là bắt buộc").max(5, "Tối đa 128 ký tự!"),
	})
	.required();

export type Schema = yup.InferType<typeof schema>;

export const userSchema = yup.object({
	name: yup.string().max(160, "Độ dài tối đa là 160 ký tự"),
	phone: yup.string().max(20, "Độ dài tối đa là 20 ký tự"),
	address: yup.string().max(160, "Độ dài tối đa là 160 ký tự"),
	avatar: yup.string().max(1000, "Độ dài tối đa là 1000 ký tự"),
	date_of_birth: yup.date().max(new Date(), "Ngày sinh không hợp lệ"),
	password: schema.fields["password"],
	new_password: schema.fields["password"],
	confirm_password: handleConfirmPasswordYup("new_password"),
});

export type UserSchema = yup.InferType<typeof userSchema>;
