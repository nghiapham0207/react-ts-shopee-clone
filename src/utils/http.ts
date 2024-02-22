import axios, { AxiosError, HttpStatusCode, type AxiosInstance } from "axios";
import { toast } from "react-toastify";
import { AuthResponse, RefreshTokenResponse } from "../types/auth.type";
import {
	setAccessTokenToLS,
	clearLS,
	getAccessTokenFromLS,
	setProfileToLS,
	setRefreshTokenToLS,
	getRefreshTokenFromLS,
} from "./auth";
import config from "../constants/config";
import { URL_LOGIN, URL_REFRESH_TOKEN, URL_REGISTER } from "../apis/auth.api";
import { isAxiosExpiredTokenError, isAxiosUnauthorizedError } from "./utils";
import { ErrorResponse } from "../types/utils.type";

const SECOND = 1;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

class Http {
	instance: AxiosInstance;
	private accessToken: string;
	private refreshToken: string;
	private refreshTokenRequest: Promise<string> | null;

	constructor() {
		this.accessToken = getAccessTokenFromLS();
		this.refreshToken = getRefreshTokenFromLS();
		this.refreshTokenRequest = null;
		this.instance = axios.create({
			baseURL: config.baseUrl,
			timeout: 10 * 1000,
			headers: {
				"Content-Type": "application/json",
				// "expire-access-token": 10,
				// "expire-refresh-token": 60 * 60,
				"expire-access-token": DAY,
				"expire-refresh-token": 7 * DAY,
			},
		});
		this.instance.interceptors.request.use(
			(config) => {
				if (this.accessToken) {
					config.headers.Authorization = this.accessToken;
				}
				return config;
			},
			(error) => {
				return Promise.reject(error);
			},
		);
		this.instance.interceptors.response.use(
			(response) => {
				const { url } = response.config;
				if (url === URL_LOGIN || url === URL_REGISTER) {
					const data = response.data as AuthResponse;
					this.accessToken = data.data.access_token;
					this.refreshToken = data.data.refresh_token;
					setAccessTokenToLS(this.accessToken);
					setRefreshTokenToLS(this.refreshToken);
					setProfileToLS(data.data.user);
				} else if (url === "/logout") {
					this.accessToken = "";
					this.refreshToken = "";
					clearLS();
				}
				return response;
			},
			(error: AxiosError) => {
				if (
					![HttpStatusCode.UnprocessableEntity, HttpStatusCode.Unauthorized].includes(
						error.response?.status as number,
					)
				) {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const data: any | undefined = error.response?.data;
					const message = data?.message || error.message;
					toast(message, { type: "error" });
				}
				// 401 error
				if (isAxiosUnauthorizedError<ErrorResponse<{ name: string; message: string }>>(error)) {
					const config = error.response?.config;
					const url = config?.url || "";
					if (isAxiosExpiredTokenError(error) && url !== URL_REFRESH_TOKEN) {
						// toast("Token hết hạn!", {
						// 	autoClose: 3000,
						// 	position: "top-center",
						// 	type: "warning",
						// });
						this.refreshTokenRequest = this.refreshTokenRequest
							? this.refreshTokenRequest
							: this.handleRefreshToken().finally(() => {
									setTimeout(() => {
										this.refreshTokenRequest = null;
									}, 10000);
							  });
						return this.refreshTokenRequest.then((access_token) => {
							// retry request
							return this.instance({
								...config,
								headers: { ...config?.headers, authorization: access_token },
							});
						});
					}
				}
				// token issues
				this.accessToken = "";
				this.refreshToken = "";
				clearLS();
				return Promise.reject(error);
			},
		);
	}
	private handleRefreshToken() {
		return this.instance
			.post<RefreshTokenResponse>(URL_REFRESH_TOKEN, {
				refresh_token: this.refreshToken,
			})
			.then((res) => {
				const { access_token } = res.data.data;
				setAccessTokenToLS(access_token);
				this.accessToken = access_token;
				return access_token;
			})
			.catch((error) => {
				clearLS();
				this.accessToken = "";
				this.refreshToken = "";
				throw error;
			});
	}
}

const http = new Http().instance;

export { Http };

export default http;
