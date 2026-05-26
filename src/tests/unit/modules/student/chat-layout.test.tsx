import { test } from '@jest/globals'
import { assert } from '@/tests/helpers/assert'
import { readSource } from '@/tests/helpers/source'

test('student chat constrains the conversation panel and scrolls messages internally', () => {
  const pageSource = readSource('modules/student/chat/page/Page.tsx')
  const messageHistorySource = readSource(
    'modules/student/chat/components/ChatMessageHistory.tsx'
  )
  const historyMenuSource = readSource(
    'modules/student/chat/components/ChatHistoryMenu.tsx'
  )

  assert.match(pageSource, /minmax\(0,1fr\)/)
  assert.match(pageSource, /calc\(100vh - 200px\)/)
  assert.match(messageHistorySource, /data-testid="chat-message-scroll"/)
  assert.match(messageHistorySource, /overflow-y-auto/)
  assert.match(messageHistorySource, /minHeight: 0/)
  assert.match(historyMenuSource, /min-h-0 flex-1 overflow-y-auto/)
})
