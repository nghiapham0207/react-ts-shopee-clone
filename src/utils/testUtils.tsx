import { render, screen, waitFor, waitForOptions } from "@testing-library/react";
import { expect } from "vitest";
import App from "../App";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";

const delay = (time: number) =>
	new Promise((res) => {
		setTimeout(() => {
			res(true);
		}, time);
	});

export const logScreen = async (
	body: HTMLElement = document.body.parentElement as HTMLElement,
	options?: waitForOptions,
) => {
	const { timeout = 1000 } = options || {};
	await waitFor(
		async () => {
			expect(await delay(timeout - 100)).toBe(true);
		},
		{
			...options,
			timeout,
		},
	);
	screen.debug(body, 99999999);
};

export const renderWithRouter = ({ route = "/" } = {}) => {
	const user = userEvent.setup();
	window.history.pushState({}, "TEST", route);
	return { user, ...render(<App />, { wrapper: BrowserRouter }) };
};
