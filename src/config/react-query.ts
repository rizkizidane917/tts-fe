import { QueryClient } from "@tanstack/react-query";

const getQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        networkMode: "offlineFirst",
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        refetchOnReconnect: false,
      },
    },
  });

export default getQueryClient;
