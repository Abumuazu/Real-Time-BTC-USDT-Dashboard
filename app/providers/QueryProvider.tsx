import React from "react";
import { useIsRestoring } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createMMKVPersister } from "../shared/storage/persister-mmkv";
import { queryClient } from "../shared/queryClientSingleton";

queryClient.setDefaultOptions({
  queries: {
    staleTime: 5_000,
    gcTime: 1000 * 60 * 10,
    refetchOnReconnect: "always",
    refetchOnWindowFocus: false,
    networkMode: "online",
  },
  mutations: {
    networkMode: "online",
    retry: 3,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30_000),
  },
});

const persister = createMMKVPersister("rq-cache");

export const QueryProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: 1000 * 60 * 60,
        dehydrateOptions: { shouldDehydrateMutation: () => true },
      }}
      onSuccess={() => {
        queryClient.resumePausedMutations().catch(() => {});
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
};
export const useRQIsRestoring = useIsRestoring;
