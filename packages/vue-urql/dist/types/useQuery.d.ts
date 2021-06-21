import { DocumentNode } from 'graphql';
import { WatchStopHandle, Ref } from 'vue';
import { Client, OperationResult, TypedDocumentNode, CombinedError, OperationContext, RequestPolicy, Operation } from '@urql/core';
declare type MaybeRef<T> = T | Ref<T>;
export interface UseQueryArgs<T = any, V = object> {
    query: MaybeRef<TypedDocumentNode<T, V> | DocumentNode | string>;
    variables?: MaybeRef<V>;
    requestPolicy?: MaybeRef<RequestPolicy>;
    context?: MaybeRef<Partial<OperationContext>>;
    pause?: MaybeRef<boolean>;
}
export declare type QueryPartialState<T = any, V = object> = Partial<OperationResult<T, V>> & {
    fetching?: boolean;
};
export interface UseQueryState<T = any, V = object> {
    fetching: Ref<boolean>;
    stale: Ref<boolean>;
    data: Ref<T | undefined>;
    error: Ref<CombinedError | undefined>;
    extensions: Ref<Record<string, any> | undefined>;
    operation: Ref<Operation<T, V> | undefined>;
    isPaused: Ref<boolean>;
    resume(): void;
    pause(): void;
    executeQuery(opts?: Partial<OperationContext>): UseQueryResponse<T, V>;
}
export declare type UseQueryResponse<T, V> = UseQueryState<T, V> & PromiseLike<UseQueryState<T, V>>;
export declare function useQuery<T = any, V = object>(args: UseQueryArgs<T, V>): UseQueryResponse<T, V>;
export declare function callUseQuery<T = any, V = object>(_args: UseQueryArgs<T, V>, client?: Client, stops?: WatchStopHandle[]): UseQueryResponse<T, V>;
export {};
