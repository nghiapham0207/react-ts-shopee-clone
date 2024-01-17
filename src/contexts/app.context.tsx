import { Dispatch, SetStateAction, createContext, useState } from "react";
import { getAccessTokenFromLS, getProfileFromLS } from "../utils/auth";
import { User } from "../types/user.type";
import { IExtendedPurchase } from "../types/purchase.type";

interface AppContextInterface {
	isAuthenticated: boolean;
	setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
	profile: User | null;
	setProfile: Dispatch<SetStateAction<User | null>>;
	extendedPurchases: IExtendedPurchase[];
	setExtendedPurchases: Dispatch<SetStateAction<IExtendedPurchase[]>>;
	reset: () => void;
}

const initialAppContext: AppContextInterface = {
	isAuthenticated: Boolean(getAccessTokenFromLS()),
	setIsAuthenticated: () => null,
	profile: getProfileFromLS(),
	setProfile: () => null,
	extendedPurchases: [],
	setExtendedPurchases: () => null,
	reset: () => null,
};

export const AppContext = createContext<AppContextInterface>(initialAppContext);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
		initialAppContext.isAuthenticated,
	);
	const [extendedPurchases, setExtendedPurchases] = useState<IExtendedPurchase[]>(
		initialAppContext.extendedPurchases,
	);
	const reset = () => {
		setIsAuthenticated(false);
		setExtendedPurchases([]);
		setProfile(null);
	};

	const [profile, setProfile] = useState<User | null>(initialAppContext.profile);
	return (
		<AppContext.Provider
			value={{
				isAuthenticated,
				setIsAuthenticated,
				profile,
				setProfile,
				extendedPurchases,
				setExtendedPurchases,
				reset,
			}}>
			{children}
		</AppContext.Provider>
	);
};
