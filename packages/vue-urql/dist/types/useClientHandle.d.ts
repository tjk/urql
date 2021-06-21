import { DocumentNode } from 'graphql';
import { Client, TypedDocumentNode } from '@urql/core';
import { UseQueryArgs, UseQueryResponse } from './useQuery';
import { UseMutationResponse } from './useMutation';
import { UseSubscriptionArgs, SubscriptionHandlerArg, UseSubscriptionResponse } from './useSubscription';
export interface ClientHandle {
    client: Client;
    useQuery<T = any, V = object>(args: UseQueryArgs<T, V>): UseQueryResponse<T, V>;
    useSubscription<T = any, R = T, V = object>(args: UseSubscriptionArgs<T, V>, handler?: SubscriptionHandlerArg<T, R>): UseSubscriptionResponse<T, R, V>;
    useMutation<T = any, V = any>(query: TypedDocumentNode<T, V> | DocumentNode | string): UseMutationResponse<T, V>;
}
export declare function useClientHandle(): ClientHandle;
