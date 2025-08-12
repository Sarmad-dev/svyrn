/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useInfiniteScroll = ({
  queryKey,
  queryFn,
  enabled = true,
  getNextPageParam = () => undefined,
  initialPageParam = undefined,
  ...options
}: {
  queryKey: string[];
  queryFn: (context: { pageParam?: any }) => Promise<any>;
  enabled?: boolean;
  getNextPageParam?: (lastPage: any) => any;
  initialPageParam?: any;
  [key: string]: any;
}) => {
  return useInfiniteQuery({
    queryKey,
    queryFn,
    enabled,
    getNextPageParam,
    initialPageParam,
    ...options,
  });
};
