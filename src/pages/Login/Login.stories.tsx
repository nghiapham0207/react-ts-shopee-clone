import { Meta, StoryObj } from "@storybook/react";

import Login from "./Login";
import RegisterLayout from "../../layouts/RegisterLayout";

const meta = {
	title: "Pages/Login",
	component: Login,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		children: {
			description: "ReactNode",
		},
	},
} satisfies Meta<typeof Login>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const LoginPage: Story = {
	render: () => (
		<RegisterLayout>
			<Login />
		</RegisterLayout>
	),
};
