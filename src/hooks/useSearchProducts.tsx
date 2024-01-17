import omit from "lodash/omit";
import { yupResolver } from "@hookform/resolvers/yup";
import { createSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import path from "../constants/path";
import { Schema, schema } from "../utils/rules";
import useQueryConfig from "./useQueryConfig";

type FormData = Pick<Schema, "name">;
const nameSchema = schema.pick(["name"]);

export default function useSearchProducts() {
	const navigate = useNavigate();
	const queryConfig = useQueryConfig();
	const { handleSubmit, register } = useForm<FormData>({
		defaultValues: {
			name: "",
		},
		resolver: yupResolver(nameSchema),
	});
	const onSubmitSearch = handleSubmit((data) => {
		const config = queryConfig.order
			? omit(
					{
						...queryConfig,
						name: data.name,
					},
					["order", "sort_by"],
			  )
			: {
					...queryConfig,
					name: data.name,
			  };
		navigate({
			pathname: path.home,
			search: createSearchParams(config).toString(),
		});
	});
	return { register, onSubmitSearch };
}
