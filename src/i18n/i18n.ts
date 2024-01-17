import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import home_en from "../locales/en/home.json";
import product_en from "../locales/en/product.json";
import home_vi from "../locales/vi/home.json";
import product_vi from "../locales/vi/product.json";

export const locales = {
	en: "English",
	vi: "Tiếng Việt",
} as const;

export const resources = {
	en: {
		home: home_en,
		product: product_en,
	},
	vi: {
		home: home_vi,
		product: product_vi,
	},
} as const;

export const defaultNs = "home" as const;

i18n.use(initReactI18next).init({
	resources,
	lng: "vi",
	ns: ["home", "product"],
	fallbackLng: "vi",
	defaultNS: defaultNs,
	interpolation: {
		escapeValue: false, // react already safes from xss
	},
});

export default i18n;
