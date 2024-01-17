import { beforeEach, describe, expect, it } from "vitest";
import { renderWithRouter } from "../../utils/testUtils";
import path from "../../constants/path";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

describe("Login", () => {
	beforeEach(async () => {
		renderWithRouter({ route: path.login });
		await waitFor(() => {
			expect(screen.queryByPlaceholderText("Email")).toBeInTheDocument();
		});
	});
	it("Show required error", async () => {
		const submitButton = document.querySelector("form button[type='submit']") as Element;
		fireEvent.click(submitButton);
		expect(await screen.findByText(/Email là bắt buộc!/i)).toBeTruthy();
		expect(await screen.findByText(/Password là bắt buộc!/i)).toBeTruthy();
		// await logScreen();
	});
	it("Show input error", async () => {
		const emailInput = document.querySelector("form input[type='email']") as HTMLInputElement;
		const passwordInput = document.querySelector("form input[type='password']") as HTMLInputElement;
		const submitButton = document.querySelector("form button[type='submit']") as HTMLButtonElement;
		fireEvent.change(emailInput, {
			target: {
				value: "noemail",
			},
		});
		fireEvent.change(passwordInput, {
			target: {
				value: "123",
			},
		});
		fireEvent.click(submitButton);
		expect(await screen.findByText(/Email không đúng định dạng!/i)).toBeTruthy();
		expect(await screen.findByText(/Độ dài từ 6 - 160 ký tự!/i)).toBeTruthy();
	});
});
