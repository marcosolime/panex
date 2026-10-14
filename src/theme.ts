import { useColorScheme } from 'react-native'

// Palette "a blocchi" ispirata al prototipo: chiara e scura.
export const palette = {
  light: { bg: '#d9d3c1', panel: '#efeadb', ink: '#262626', muted: '#5a5a5a', line: '#262626', soft: '#cfc8b2', green: '#3f8a22', red: '#b83a2e', gold: '#f2b705', coin: '#8a5a00', pos: '#2f7d1a' },
  dark: { bg: '#1c1c1c', panel: '#2c2c2c', ink: '#eeeeee', muted: '#aaaaaa', line: '#0a0a0a', soft: '#3d3d3d', green: '#3f8a22', red: '#b83a2e', gold: '#f2b705', coin: '#f2c94c', pos: '#7ed348' },
}

export const fonts = { body: 'VT323_400Regular', title: 'PressStart2P_400Regular' }

export function useTheme() {
  return useColorScheme() === 'dark' ? palette.dark : palette.light
}
