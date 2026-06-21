import '@testing-library/jest-dom/jest-globals'
import { File } from 'node:buffer'
import { fetch, FormData, Headers, Request, Response } from 'undici'

Object.assign(globalThis, {
  fetch,
  File,
  FormData,
  Headers,
  Request,
  Response,
})
