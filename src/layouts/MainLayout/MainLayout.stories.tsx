import { Meta, StoryObj } from "@storybook/react";
import { reactRouterParameters } from "storybook-addon-react-router-v6";

import MainLayout from "./MainLayout";
import ProductDetail from "../../pages/ProductDetail";
import path from "../../constants/path";

const meta = {
	title: "Layouts/MainLayout",
	component: MainLayout,
	parameters: {
		reactRouter: reactRouterParameters({
			location: {
				pathParams: {
					nameId: "Điện-Thoại-Vsmart-Active-3-6GB64GB--Hàng-Chính-Hãng.-i.60afb2c76ef5b902180aacba",
				},
			},
			routing: {
				path: path.productDetail,
			},
		}),
	},
	tags: ["autodocs"],
	argTypes: {
		children: {
			description: "ReactNode",
		},
	},
} satisfies Meta<typeof MainLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PageProductDetail: Story = {
	args: {
		children: <ProductDetail />,
	},
};

export const Primary: Story = {};
