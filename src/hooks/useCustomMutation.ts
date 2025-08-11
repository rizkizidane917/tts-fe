import { rootAxios, RootAxiosParams } from "@/config/rootAxios";
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query";

export const useCustomMutation = <
  TData = unknown,
  TError = unknown,
  TVariables extends RootAxiosParams = RootAxiosParams
>(
  options?: UseMutationOptions<TData, TError, TVariables>
): UseMutationResult<TData, TError, TVariables> => {
  return useMutation({
    mutationFn: ({ payload, path, method, api, params }: TVariables) =>
      rootAxios<TData>({ payload, path, method, api, params }),
    ...options,
  });
};
