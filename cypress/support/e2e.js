// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Ignore Vite WebSocket errors in Cypress
Cypress.on('uncaught:exception', (err, runnable) => {
  // Ignore Vite WebSocket errors
  if (err.message.includes('__WS_TOKEN__') || err.message.includes('@vite/client')) {
    return false
  }
  
  // Ignore other common development errors
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false
  }
  
  // Return true for other errors to fail the test
  return true
})