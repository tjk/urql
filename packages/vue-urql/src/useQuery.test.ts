import { queryGql, queryOperation, queryResponse } from '../../core/src/test-utils';
import { createClient, dedupExchange, cacheExchange, fetchExchange, ssrExchange } from '@urql/core';

const serializedQueryResponse = {
  ...queryResponse,
  data: JSON.stringify(queryResponse.data),
};
const ssr = ssrExchange({
  isClient: true,
  initialState: {
    deadbeef: serializedQueryResponse as any,
  },
});
const ssrClient = createClient({ 
  url: queryOperation.context.url,
  exchanges: [
    dedupExchange, 
    cacheExchange, 
    ssr, 
    fetchExchange,
  ],
  requestPolicy: "cache-and-network",
  suspense: true, // XXX should this be like this?
});
jest.mock('./useClient.ts', () => ({
  __esModule: true,
  ...jest.requireActual('./useClient.ts'),
  useClient: () => ssrClient,
}));

import { pipe, makeSubject, fromValue, delay } from 'wonka';
import { useQuery } from './useQuery';
import { nextTick, ref, reactive } from 'vue';

describe('useQuery', () => {
  it('runs queries as a promise-like that resolves (with ssr initialState)', async () => {
    const useQueryInput = {...queryGql}
    delete useQueryInput.key
    const result = useQuery(useQueryInput)
    console.log("result.data.value", result.data.value)
    console.log("result.fetching.value", result.fetching.value)
    await result
    console.log("** SUCCESS **")
    expect(1).toBe(1)
  });
});
