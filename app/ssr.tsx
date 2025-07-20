import {
  createStartHandler,
  defaultStreamHandler,
} from '@tanstack/start/server'
import { createRouterInstance } from './router'

export default createStartHandler({
  createRouter: createRouterInstance,
})(defaultStreamHandler)