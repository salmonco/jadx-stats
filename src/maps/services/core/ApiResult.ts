import { AxiosResponseHeaders } from "axios";

export type ApiResult<TData = any> = {
	readonly body: TData;
	readonly ok: boolean;
	readonly status: number;
	readonly statusText: string;
	readonly url: string;
	// headers should be axios headers
	readonly headers: AxiosResponseHeaders;
};