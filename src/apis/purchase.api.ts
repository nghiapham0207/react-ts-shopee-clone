import { IPurchase, PurchaseListStatus } from "../types/purchase.type";
import { SuccessResponse } from "../types/utils.type";
import http from "../utils/http";

const URL = "purchases";

const purchaseApi = {
	addToCart(body: { product_id: string; buy_count: number }) {
		return http.post<SuccessResponse<IPurchase>>(`${URL}/add-to-cart`, body);
	},
	getPurchases(params: { status: PurchaseListStatus }) {
		return http.get<SuccessResponse<IPurchase[]>>(`${URL}`, { params });
	},
	buyProducts(body: { product_id: string; buy_count: number }[]) {
		return http.post<SuccessResponse<IPurchase[]>>(`${URL}/buy-products`, body);
	},
	updatePurchase(body: { product_id: string; buy_count: number }) {
		return http.put<SuccessResponse<IPurchase>>(`${URL}/update-purchase`, body);
	},
	deletePurchase(purchaseIds: string[]) {
		return http.delete<SuccessResponse<{ deleted_count: number }>>(`${URL}`, {
			data: purchaseIds,
		});
	},
};

export default purchaseApi;
