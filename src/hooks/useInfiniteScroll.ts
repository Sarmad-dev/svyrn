"use client";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useInfiniteScroll = ({
  queryKey,
  queryFn,
  enabled = true,
  getNextPageParam,
  ...options
}: {
  queryKey: string[];
  queryFn: (context: { pageParam?: any }) => Promise<any>;
  enabled?: boolean;
  getNextPageParam?: (lastPage: any) => any;
  [key: string]: any;
}) => {
  return useInfiniteQuery({
    queryKey,
    queryFn,
    enabled,
    getNextPageParam,
    ...options,
  });
};
