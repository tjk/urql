/* eslint-disable react-hooks/rules-of-hooks */

import { DocumentNode } from 'graphql';

import { WatchStopHandle, Ref, ref, watchEffect, reactive, isRef } from 'vue';

import {
  Source,
  concat,
  switchAll,
  share,
  fromValue,
  makeSubject,
  filter,
  map,
  pipe,
  take,
  publish,
  onEnd,
  onStart,
  onPush,
  toPromise,
} from 'wonka';

import {
  Client,
  OperationResult,
  TypedDocumentNode,
  CombinedError,
  OperationContext,
  RequestPolicy,
  Operation,
  createRequest,
  GraphQLRequest,
} from '@urql/core';

import { useClient } from './useClient';

type MaybeRef<T> = T | Ref<T>;

export interface UseQueryArgs<T = any, V = object> {
  query: MaybeRef<TypedDocumentNode<T, V> | DocumentNode | string>;
  variables?: MaybeRef<V>;
  requestPolicy?: MaybeRef<RequestPolicy>;
  context?: MaybeRef<Partial<OperationContext>>;
  pause?: MaybeRef<boolean>;
}

export type QueryPartialState<T = any, V = object> = Partial<
  OperationResult<T, V>
> & { fetching?: boolean };

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

export type UseQueryResponse<T, V> = UseQueryState<T, V> &
  PromiseLike<UseQueryState<T, V>>;

const watchOptions = {
  flush: 'pre' as const,
};

/** Wonka Operator to replay the most recent value to sinks */
function replayOne<T>(source: Source<T>): Source<T> {
  let cached: undefined | T;

  return concat([
    pipe(
      fromValue(cached!),
      map(() => cached!),
      filter(x => x !== undefined)
    ),
    pipe(
      source,
      onPush(value => {
        cached = value;
      }),
      share
    ),
  ]);
}

export function useQuery<T = any, V = object>(
  args: UseQueryArgs<T, V>
): UseQueryResponse<T, V> {
  return callUseQuery(args);
}

export function callUseQuery<T = any, V = object>(
  _args: UseQueryArgs<T, V>,
  client: Client = useClient(),
  stops: WatchStopHandle[] = []
): UseQueryResponse<T, V> {
  const args = reactive(_args);

  const data: Ref<T | undefined> = ref();
  const stale: Ref<boolean> = ref(false);
  const fetching: Ref<boolean> = ref(false);
  const error: Ref<CombinedError | undefined> = ref();
  const operation: Ref<Operation<T, V> | undefined> = ref();
  const extensions: Ref<Record<string, any> | undefined> = ref();

  const isPaused: Ref<boolean> = isRef(_args.pause)
    ? _args.pause
    : ref(!!_args.pause);

  const request: Ref<GraphQLRequest<T, V>> = ref(
    createRequest<T, V>(args.query, args.variables as V) as any
  );

  const source: Ref<Source<Source<any>>> = ref(null as any);
  const next: Ref<
    (query$: undefined | Source<OperationResult<T, V>>) => void
  > = ref(null as any);

  stops.push(
    watchEffect(() => {
      const newRequest = createRequest<T, V>(args.query, args.variables as any);
      if (request.value.key !== newRequest.key) {
        request.value = newRequest;
      }
    }, watchOptions)
  );

  const state: UseQueryState<T, V> = {
    data,
    stale,
    error,
    operation,
    extensions,
    fetching,
    isPaused,
    executeQuery(opts?: Partial<OperationContext>): UseQueryResponse<T, V> {
      next.value(
        client.executeQuery<T, V>(request.value, {
          requestPolicy: args.requestPolicy,
          ...args.context,
          ...opts,
        })
      );

      return response;
    },
    pause() {
      isPaused.value = true;
    },
    resume() {
      isPaused.value = false;
    },
  };

  const getState = () => state;

  stops.push(
    watchEffect(
      onInvalidate => {
        const subject = makeSubject<Source<any>>();
        source.value = pipe(subject.source, replayOne);
        next.value = (value: undefined | Source<any>) => {
          let onStartCalled = false;
          const doOnStart = () => {
            if (onStartCalled) return;
            onStartCalled = true;
            fetching.value = true;
            stale.value = false;
          };
          const query$ = pipe(
            value
              ? pipe(
                  value,
                  onStart(doOnStart),
                  onPush(res => {
                    doOnStart();
                    data.value = res.data;
                    stale.value = !!res.stale;
                    fetching.value = false;
                    error.value = res.error;
                    operation.value = res.operation;
                    extensions.value = res.extensions;
                  }),
                  share
                )
              : fromValue(undefined),
            onEnd(() => {
              fetching.value = false;
              stale.value = false;
            })
          );

          subject.next(query$);
        };

        onInvalidate(
          pipe(source.value, switchAll, map(getState), publish).unsubscribe
        );
      },
      {
        // NOTE: This part of the query pipeline is only initialised once and will need
        // to do so synchronously
        flush: 'sync',
      }
    )
  );

  stops.push(
    watchEffect(() => {
      next.value(
        !isPaused.value
          ? client.executeQuery<T, V>(request.value, {
              requestPolicy: args.requestPolicy,
              ...args.context,
            })
          : undefined
      );
    }, watchOptions)
  );

  const response: UseQueryResponse<T, V> = {
    ...state,
    then(onFulfilled, onRejected) {
      return (data.value
        ? Promise.resolve(state)
        : pipe(source.value, switchAll, map(getState), take(1), toPromise)
      ).then(onFulfilled, onRejected);
    },
  };

  return response;
}
