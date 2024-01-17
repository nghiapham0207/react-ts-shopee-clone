import { beforeEach, describe, expect, it } from "vitest";
import { Http } from "../http";
import { HttpStatusCode } from "axios";
import { setAccessTokenToLS, setRefreshTokenToLS } from "../auth";

describe("http axios", () => {
	let http = new Http().instance;
	beforeEach(() => {
		localStorage.clear();
		http = new Http().instance;
	});
	const access_token =
		"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyOTVkNDhkNmViYzAwMWNmMmRlOWVlNiIsImVtYWlsIjoibmdoaWFAZ21haWwuY29tIiwicm9sZXMiOlsiVXNlciJdLCJjcmVhdGVkX2F0IjoiMjAyNC0wMS0xMFQxMzo1NTozMy44MjRaIiwiaWF0IjoxNzA0ODk0OTMzLCJleHAiOjE3MDQ4OTQ5MzR9.zBbSjiT8Aqn9I9tOsoghdD7hzmr_gTgokeWdg7y_gzM";
	const refresh_token =
		"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyOTVkNDhkNmViYzAwMWNmMmRlOWVlNiIsImVtYWlsIjoibmdoaWFAZ21haWwuY29tIiwicm9sZXMiOlsiVXNlciJdLCJjcmVhdGVkX2F0IjoiMjAyNC0wMS0xMFQxMzo1ODozNi44NTBaIiwiaWF0IjoxNzA0ODk1MTE2LCJleHAiOjE3MDQ5MDIzMTZ9.HObyGLaOGQNAotEi1H80aGZuHuH7Wm25PfTkXZrV9YA";
	it("call api", async () => {
		const res = await http.get("products");
		expect(res.status).toBe(HttpStatusCode.Ok);
	});
	it("auth request", async () => {
		await http.post("login", {
			email: "nghia@gmail.com",
			password: "123456",
		});
		const res = await http.get("me");
		expect(res.status).toBe(HttpStatusCode.Ok);
	});
	it("refresh token", async () => {
		setAccessTokenToLS(access_token);
		setRefreshTokenToLS(refresh_token);
		const http = new Http().instance;
		const res = await http.get("me");
		expect(res.status).toBe(HttpStatusCode.Ok);
	});
});
