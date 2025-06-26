import '@testing-library/jest-dom'

// Polyfill TextEncoder et TextDecoder pour Jest (Node < 18)
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// Mock pour les modules CSS
jest.mock('*.css', () => ({}))
jest.mock('*.scss', () => ({}))

// Mock pour les icônes Lucide React
jest.mock('lucide-react', () => ({
  User: () => 'User',
  LogOut: () => 'LogOut',
  Leaf: () => 'Leaf',
  Users: () => 'Users',
  Mail: () => 'Mail',
  Calendar: () => 'Calendar',
  MapPin: () => 'MapPin',
  Hash: () => 'Hash'
}))

// Mock pour axios
jest.mock('axios', () => ({
  post: jest.fn(),
  get: jest.fn(),
  delete: jest.fn()
}))

// Mock complet de localStorage pour Jest
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => { store[key] = value + ''; }),
    removeItem: jest.fn((key) => { delete store[key]; }),
    clear: jest.fn(() => { store = {}; }),
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Set process.env for Jest
process.env.VITE_API_URL = 'http://localhost:8000';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}; 