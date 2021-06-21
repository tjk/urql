import { DocumentNode } from 'graphql';
import { WatchStopHandle, Ref } from 'vue';
import { Client, TypedDocumentNode, CombinedError, OperationContext, Operation } from '@urql/core';
declare type MaybeRef<T> = T | Ref<T>;
export interface UseSubscriptionArgs<T = any, V = object> {
    query: MaybeRef<TypedDocumentNode<T, V> | DocumentNode | string>;
    variables?: MaybeRef<V>;
    pause?: MaybeRef<boolean>;
    context?: MaybeRef<Partial<OperationContext>>;
}
export declare type SubscriptionHandler<T, R> = (prev: R | undefined, data: T) => R;
export declare type SubscriptionHandlerArg<T, R> = MaybeRef<SubscriptionHandler<T, R>>;
export interface UseSubscriptionState<T = any, R = T, V = object> {
    fetching: Ref<boolean>;
    stale: Ref<boolean>;
    data: Ref<R | undefined>;
    error: Ref<CombinedError | undefined>;
    extensions: Ref<Record<string, any> | undefined>;
    operation: Ref<Operation<T, V> | undefined>;
    isPaused: Ref<boolean>;
    resume(): void;
    pause(): void;
    executeSubscription(opts?: Partial<OperationContext>): void;
}
export declare type UseSubscriptionResponse<T = any, R = T, V = object> = UseSubscriptionState<T, R, V>;
export declare function useSubscription<T = any, R = T, V = object>(args: UseSubscriptionArgs<T, V>, handler?: SubscriptionHandlerArg<T, R>): UseSubscriptionResponse<T, R, V>;
export declare function callUseSubscription<T = any, R = T, V = object>(_args: UseSubscriptionArgs<T, V>, handler?: SubscriptionHandlerArg<T, R>, client?: Client, stops?: WatchStopHandle[]): UseSubscriptionResponse<T, R, V>;
export {};
