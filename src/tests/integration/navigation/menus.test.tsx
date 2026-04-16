import { assert } from '@/tests/helpers/assert'
import { test } from '@jest/globals'
import { readSource } from '@/tests/helpers/source'

test('navigation index composes menus for all roles', () => {
  const source = readSource('app/navigation/index.tsx')

  assert.match(source, /NAVIGATION_BY_ROLE/)
  assert.match(source, /studentNavigation/)
  assert.match(source, /parentNavigation/)
  assert.match(source, /adminNavigation/)
  assert.match(source, /schoolNavigation/)
  assert.match(source, /companyNavigation/)
})
