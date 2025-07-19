import {
  createStartHandler,
  defaultStreamHandler,
} from '@tanstack/start/server'
import { getRouterManifest } from '@tanstack/start/router-manifest'
import { createRouterInstance } from './router'

export default createStartHandler({
  createRouter: createRouterInstance,
  getRouterManifest,
})(defaultStreamHandler)