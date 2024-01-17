import { Meta, StoryObj } from "@storybook/react";
import Button from "./Button";

const meta = {
	title: "Components/Button",
	component: Button,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		children: {
			description: "ReactNode",
		},
		className: {
			description: "Class attribute of html element",
		},
		isLoading: {
			defaultValue: false,
			description: "Show loading icon when calling api",
		},
	},
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	args: {
		children: "Login",
		className:
			"flex w-full items-center justify-center rounded bg-red-500 px-2 py-4 text-sm uppercase text-white hover:bg-red-600",
		isLoading: false,
	},
};

export const Secondary: Story = {
	args: {
		children: "Register",
		className:
			"flex w-full items-center justify-center rounded bg-red-500 px-2 py-4 text-sm uppercase text-white hover:bg-red-600",
		isLoading: false,
		disabled: true,
	},
};
