export default {
  "peche-backend": {
    output: {
      target: "src/lib/orval/store.ts",
      schemas: "src/lib/orval/model",
      client: "react-query",
      mode: "tags-split",
      override: {
        query: {
          useQuery: true,
          useInfinite: true,
          useInfiniteQueryParam: "page",
        },
        mutator: {
          path: "src/lib/api/http-client.ts",
          name: "customInstance",
        },
      },
    },
    input: {},
  },
}
