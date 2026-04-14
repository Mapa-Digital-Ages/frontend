import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import BarChart from '../../../../modules/student/shared/components/BarChart'

test('BarChart keeps zero values measurable when maxValue is zero', () => {
  const html = renderToStaticMarkup(
    <BarChart data={[{ label: 'Seg', value: 0 }]} maxValue={0} />
  )

  assert.match(html, /height:0%/)
  assert.doesNotMatch(html, /NaN/)
})

test('BarChart keeps each bar column full height and exposes accessible bar labels', () => {
  const html = renderToStaticMarkup(
    <BarChart data={[{ label: 'Seg', value: 2 }]} maxValue={4} />
  )
  const source = readFileSync(
    new URL(
      '../../../../modules/student/shared/components/BarChart.tsx',
      import.meta.url
    ),
    'utf8'
  )

  assert.match(html, /aria-label="Seg: 2"/)
  assert.match(source, /gridTemplateRows/)
  assert.match(source, /height: '100%'/)
  assert.match(source, /barTrackBackground/)
  assert.match(source, /overflow: 'hidden'/)
  assert.match(source, /borderRadius: '8px'/)
})
