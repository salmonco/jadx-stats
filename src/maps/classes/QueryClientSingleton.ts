import { QueryClient } from "@tanstack/react-query";

class QueryClientSingleton {
    private static instance: QueryClient;

    private constructor() {}

    public static getInstance(): QueryClient {
        if (!QueryClientSingleton.instance) {
            QueryClientSingleton.instance = new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 1000 * 60 * 1, // 20분
                        refetchOnWindowFocus: false,
                    },
                },
            });
        }
        return QueryClientSingleton.instance;
    }
}

export default QueryClientSingleton;
