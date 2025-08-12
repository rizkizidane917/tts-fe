import { rootAxios } from "@/config/rootAxios";
import { useQuery } from "@tanstack/react-query";
type TQuery = {
  path: string;
  params?: Record<string, unknown>;
  queryKey: unknown[] | string[];
};

export const useCustomQuery = ({ path, params, queryKey }: TQuery) => {
  return useQuery({
    queryKey: [...queryKey, params],
    queryFn: () => rootAxios({ method: "get", path, params }),
  });
};
