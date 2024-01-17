import { describe, expect, it } from "vitest";
import {
	clearLS,
	getAccessTokenFromLS,
	getRefreshTokenFromLS,
	setAccessTokenToLS,
	setRefreshTokenToLS,
} from "../auth";

const access_token =
	"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NWNjMjMzYjExNDAwODkzZGY3MDJlMyIsImVtYWlsIjoibmdoaWFwaGFtMDIwNzIwMDFAZ21haWwuY29tIiwicm9sZXMiOlsiVXNlciJdLCJjcmVhdGVkX2F0IjoiMjAyNC0wMS0wOVQxMzozNzoyMC4wOTFaIiwiaWF0IjoxNzA0ODA3NDQwLCJleHAiOjE3MDQ4MDc0NTB9.8XS_IJoS_V-4tBXV6EXGnKfJbvkMQx7zpPs3jxtECII";

const refresh_token =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NWNjMjMzYjExNDAwODkzZGY3MDJlMyIsImVtYWlsIjoibmdoaWFwaGFtMDIwNzIwMDFAZ21haWwuY29tIiwicm9sZXMiOlsiVXNlciJdLCJjcmVhdGVkX2F0IjoiMjAyNC0wMS0wOVQxMzozNzoyMC4wOTFaIiwiaWF0IjoxNzA0ODA3NDQwLCJleHAiOjE3MDQ4MTEwNDB9.VE0ghwTU4myHPNiROuUnQ4j3IwLGUrtllWfAvrpqmNw";

describe("access_token", () => {
	it("set access_token to localStorage", () => {
		setAccessTokenToLS(access_token);
		expect(localStorage.getItem("access_token")).toBe(access_token);
	});
});

describe("refresh_token", () => {
	it("set refresh_token to localStorage", () => {
		setRefreshTokenToLS(refresh_token);
		expect(localStorage.getItem("refresh_token")).toEqual(refresh_token);
	});
});

describe("clear localStorage", () => {
	it("delete access_token, refresh_token", () => {
		setAccessTokenToLS(access_token);
		setRefreshTokenToLS(refresh_token);
		clearLS();
		expect(getAccessTokenFromLS()).toEqual("");
		expect(getRefreshTokenFromLS()).toEqual("");
	});
});
