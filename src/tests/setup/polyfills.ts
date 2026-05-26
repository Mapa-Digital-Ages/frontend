import {
  ReadableStream,
  TransformStream,
  WritableStream,
} from 'node:stream/web'
import { TextDecoder, TextEncoder } from 'node:util'

type MessageHandler = ((event: MessageEvent) => void) | null

class TestMessagePort {
  onmessage: MessageHandler = null
  private target?: TestMessagePort

  connect(target: TestMessagePort) {
    this.target = target
  }

  postMessage(data: unknown) {
    const target = this.target

    setTimeout(() => {
      target?.onmessage?.({ data } as MessageEvent)
    }, 0)
  }

  start() {}

  close() {
    this.onmessage = null
    this.target = undefined
  }
}

class TestMessageChannel {
  port1: TestMessagePort
  port2: TestMessagePort

  constructor() {
    this.port1 = new TestMessagePort()
    this.port2 = new TestMessagePort()

    this.port1.connect(this.port2)
    this.port2.connect(this.port1)
  }
}

Object.assign(globalThis, {
  MessageChannel: TestMessageChannel,
  MessagePort: TestMessagePort,
  ReadableStream,
  TextDecoder,
  TextEncoder,
  TransformStream,
  WritableStream,
})
