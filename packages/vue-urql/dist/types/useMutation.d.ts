import { Ref } from 'vue';
import { DocumentNode } from 'graphql';
import { Client, TypedDocumentNode, CombinedError, Operation, OperationContext, OperationResult } from '@urql/core';
export interface UseMutationState<T, V> {
    fetching: Ref<boolean>;
    stale: Ref<boolean>;
    data: Ref<T | undefined>;
    error: Ref<CombinedError | undefined>;
    extensions: Ref<Record<string, any> | undefined>;
    operation: Ref<Operation<T, V> | undefined>;
    executeMutation: (variables: V, context?: Partial<OperationContext>) => Promise<OperationResult<T>>;
}
export declare type UseMutationResponse<T, V> = UseMutationState<T, V>;
export declare function useMutation<T = any, V = any>(query: TypedDocumentNode<T, V> | DocumentNode | string): UseMutationResponse<T, V>;
export declare function callUseMutation<T = any, V = any>(query: TypedDocumentNode<T, V> | DocumentNode | string, client?: Client): UseMutationResponse<T, V>;
