import React from 'react'
import ReactDOM from 'react-dom/client'
import { StartClient } from '@tanstack/start'
import { createRouterInstance } from './router'
import './styles/globals.css'

const router = createRouterInstance()

ReactDOM.hydrateRoot(
  document.getElementById('root')!,
  <StartClient router={router} />
)