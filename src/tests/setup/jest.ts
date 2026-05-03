import '@testing-library/jest-dom/jest-globals'
import { fetch, Headers, Request, Response } from 'undici'

Object.assign(globalThis, {
  fetch,
  Headers,
  Request,
  Response,
})
