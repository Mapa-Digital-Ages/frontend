import { assert } from '@/tests/helpers/assert'
import { test } from '@jest/globals'
import { readSource, sourceExists } from '@/tests/helpers/source'

test('request-partner service exposes create, list requests and list partnerships', () => {
  const source = readSource(
    'modules/school/request-partner/services/service.ts'
  )

  assert.match(source, /createRequest/)
  assert.match(source, /listRequests/)
  assert.match(source, /listPartnerships/)
  assert.match(source, /school\/\${encodeURIComponent\(schoolId\)}\/requests/)
  assert.match(
    source,
    /school\/\${encodeURIComponent\(schoolId\)}\/partnerships/
  )
})

test('request-partner types define the school partnership shape', () => {
  assert.ok(sourceExists('modules/school/request-partner/types/types.ts'))
  const source = readSource('modules/school/request-partner/types/types.ts')

  assert.match(source, /SchoolPartnershipApi/)
  assert.match(source, /company_name/)
  assert.match(source, /granted_spots/)
  assert.match(source, /remaining_spots/)
})

test('request-partner page renders a tracking section below the form', () => {
  const source = readSource('modules/school/request-partner/page/Page.tsx')

  assert.match(source, /data-testid="tracking-section"/)
  assert.match(source, /Meus pedidos e parcerias/)
  assert.match(source, /requestPartnerService\.listRequests/)
  assert.match(source, /requestPartnerService\.listPartnerships/)
})

test('request-partner page shows requested spots, accepted spots and statuses', () => {
  const source = readSource('modules/school/request-partner/page/Page.tsx')

  assert.match(source, /Pedido/)
  assert.match(source, /Aguardando Aprovação/)
  assert.match(source, /Aceito/)
  assert.match(source, /vagas ainda disponíveis para apoio/)
  assert.match(source, /vagas aceitas/)
  assert.match(source, /request\.remaining_spots/)
  assert.match(source, /partnership\.granted_spots/)
})

test('request-partner page reloads tracking after a successful submission', () => {
  const source = readSource('modules/school/request-partner/page/Page.tsx')

  assert.match(source, /await loadLists\(\)/)
  assert.match(source, /openRequests/)
  assert.match(source, /visiblePartnerships/)
})
