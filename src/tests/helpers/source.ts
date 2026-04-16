import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const srcRoot = resolve(process.cwd(), 'src')

export function sourcePath(relativePath: string) {
  return resolve(srcRoot, relativePath)
}

export function readSource(relativePath: string) {
  return readFileSync(sourcePath(relativePath), 'utf8')
}

export function sourceExists(relativePath: string) {
  return existsSync(sourcePath(relativePath))
}
