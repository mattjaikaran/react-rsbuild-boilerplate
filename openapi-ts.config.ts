import { defineConfig } from '@hey-api/openapi-ts'

/**
 * The vendored fixture keeps the app buildable without a backend. In a
 * mattstack monorepo, point OPENAPI_SPEC_PATH at the producer contract:
 *
 *   OPENAPI_SPEC_PATH=../backend/docs/openapi/openapi.json bun run api:generate
 */
const input = process.env.OPENAPI_SPEC_PATH ?? 'backend/docs/openapi/openapi.json'

export default defineConfig({
  input,
  output: 'src/api/generated',
  plugins: [
    '@hey-api/typescript',
    '@hey-api/client-axios',
    '@hey-api/sdk',
    {
      name: 'zod',
      compatibilityVersion: 4,
      requests: true,
      responses: true,
      definitions: true,
    },
    '@tanstack/react-query',
  ],
})
