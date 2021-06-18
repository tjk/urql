```bash
$ yarn
$ yarn jest packages/vue-urql/src/useQuery.test.ts

....

 FAIL  packages/vue-urql/src/useQuery.test.ts (5.28 s)
  useQuery
    ✕ runs queries as a promise-like that resolves (with ssr initialState) (5014 ms)

  ● useQuery › runs queries as a promise-like that resolves (with ssr initialState)

    : Timeout - Async callback was not invoked within the 5000 ms timeout specified by jest.setTimeout.Timeout - Async callback was not invoked within the 5000 ms timeout specified by jest.setTimeout.Error:

      34 |
      35 | describe('useQuery', () => {
    > 36 |   it('runs queries as a promise-like that resolves (with ssr initialState)', async () => {
         |   ^
      37 |     const useQueryInput = {...queryGql}
      38 |     delete useQueryInput.key
      39 |     const result = useQuery(useQueryInput)

      at new Spec (../../node_modules/jest-jasmine2/build/jasmine/Spec.js:116:22)
      at Suite.<anonymous> (src/useQuery.test.ts:36:3)
      at Object.<anonymous> (src/useQuery.test.ts:35:1)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        5.593 s, estimated 6 s
```
