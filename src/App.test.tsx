import { BrowserRouter, MemoryRouter } from "react-router-dom";
import { describe, expect, test } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

import App from "./App";
import path from "./constants/path";
import { renderWithRouter } from "./utils/testUtils";

// error
// expect.extend(matchers);

describe("App", () => {
	test("Render App and switch to other page", async () => {
		render(
			<BrowserRouter>
				<App />
			</BrowserRouter>,
		);
		const user = userEvent.setup();

		// home page
		await waitFor(() => {
			expect(document.querySelector("title")?.textContent).toBe("Shopee");
		});

		user.click(screen.getByText(/Đăng nhập/i));
		await waitFor(() => {
			expect(screen.queryByText("Bạn chưa có tài khoản?")).toBeInTheDocument();
		});
		await waitFor(() => {
			expect(document.querySelector("title")?.textContent).toBe("Shopee - Đăng nhập");
		});
	});

	test("Not found page", async () => {
		const badRoute = "/bad/route";
		render(
			<MemoryRouter initialEntries={[badRoute]}>
				<App />
			</MemoryRouter>,
		);
		await waitFor(() => {
			expect(screen.getByText(/không tìm thấy trang/i)).toBeInTheDocument();
		});
		// await logScreen();
	});

	test("Render Register page", async () => {
		renderWithRouter({ route: path.register });
		await waitFor(() => {
			expect(screen.getByText(/Bạn đã có tài khoản?/i)).toBeInTheDocument();
		});
		// await logScreen();
	});
});
