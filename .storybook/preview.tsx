import type { Preview } from "@storybook/react";
import { withRouter } from "storybook-addon-react-router-v6";

import React from "react";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import ErrorBoundary from "../src/components/ErrorBoundary";
import { AppProvider } from "../src/contexts/app.context";
import "../src/index.css";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: { retry: false },
		mutations: {
			retry: false,
		},
	},
});
const preview: Preview = {
	parameters: {
		actions: { argTypesRegex: "^on[A-Z].*" },
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
	},
};

export default preview;

export const decorators = [
	withRouter, // using this instead decorators: [withRouter] in Story
	(Story: any) => (
		<HelmetProvider>
			<QueryClientProvider client={queryClient}>
				<AppProvider>
					<ErrorBoundary>
						<div>
							<Story />
						</div>
					</ErrorBoundary>
				</AppProvider>
			</QueryClientProvider>
		</HelmetProvider>
	),
];
