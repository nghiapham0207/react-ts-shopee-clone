import "i18next";
import { defaultNs, resources } from "../i18n/i18n";

declare module "i18next" {
	interface CustomTypeOptions {
		defaultNS: typeof defaultNs;
		resources: (typeof resources)["vi"];
	}
}
