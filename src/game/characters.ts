import type { CharacterData } from './types'

export const CHARACTERS: CharacterData[] = [
  {
    id: 'yuji',
    name: 'YUJI ITADORI',
    title: 'Divergent Fist',
    description: 'A vessel of Ryomen Sukuna. Unmatched physical strength and Divergent Fist technique make him a deadly close-range fighter.',
    colors: {
      primary: '#FF3131',
      secondary: '#FF7777',
      aura: 'rgba(255,49,49,0.5)',
      special: '#FF0000',
    },
    stats: {
      maxHealth: 200,
      speed: 5.5,
      jumpPower: 14,
      attackPower: 22,
      specialPower: 55,
      cursedEnergy: 100,
    },
    specialName: 'DIVERGENT FIST',
    specialDescription: 'Delayed cursed energy eruption — massive AOE punch',
    ultimateName: 'BLACK FLASH',
    ultimateDescription: 'A spatial distortion that multi-hits for extreme damage',
  },
  {
    id: 'megumi',
    name: 'MEGUMI FUSHIGURO',
    title: 'Shadow Technique',
    description: 'Master of the Ten Shadows Technique. Summons shadow familiars and excels at mid-range combat with divine dog strikes.',
    colors: {
      primary: '#1E3A8A',
      secondary: '#93C5FD',
      aura: 'rgba(30,58,138,0.5)',
      special: '#3B82F6',
    },
    stats: {
      maxHealth: 200,
      speed: 6,
      jumpPower: 16,
      attackPower: 18,
      specialPower: 50,
      cursedEnergy: 100,
    },
    specialName: 'DIVINE DOG: TOTALITY',
    specialDescription: 'Shadow wolf charge that shreds through defenses',
    ultimateName: 'MAHORAGA',
    ultimateDescription: 'Summon the Eight-Handled Sword Divergent Sila Divine General Mahoraga',
  },
  {
    id: 'gojo',
    name: 'SATORU GOJO',
    title: 'Infinity: Unlimited Void',
    description: 'The strongest jujutsu sorcerer. Manipulates space itself with Infinity and Blue/Red techniques. Nearly invincible.',
    colors: {
      primary: '#A855F7',
      secondary: '#E9D5FF',
      aura: 'rgba(168,85,247,0.6)',
      special: '#6a00ffff',
    },
    stats: {
      maxHealth: 200,
      speed: 7,
      jumpPower: 18,
      attackPower: 15,
      specialPower: 80,
      cursedEnergy: 100,
    },
    specialName: 'HOLLOW PURPLE',
    specialDescription: 'Merges Blue and Red — a devastating orb of destruction',
    ultimateName: 'UNLIMITED VOID',
    ultimateDescription: 'Freezes time for the opponent while dealing massive psychic damage',
  },
  {
    id: 'sukuna',
    name: 'RYOMEN SUKUNA',
    title: 'King of Curses',
    description: 'The undisputed King of Curses. Overwhelming power, Malevolent Shrine, and the ability to cut through anything make him the ultimate threat.',
    colors: {
      primary: '#DC2626',
      secondary: '#FCA5A5',
      aura: 'rgba(220,38,38,0.7)',
      special: '#FF6B6B',
    },
    stats: {
      maxHealth: 200,
      speed: 4.5,
      jumpPower: 12,
      attackPower: 30,
      specialPower: 90,
      cursedEnergy: 100,
    },
    specialName: 'MALEVOLENT SHRINE',
    specialDescription: 'Domain Expansion — guaranteed massive damage',
    ultimateName: 'FUUGA (OPEN)',
    ultimateDescription: 'Fire arrow that incinerates everything in its path',
  },
]

export function getCharacterById(id: string): CharacterData {
  return CHARACTERS.find(c => c.id === id) ?? CHARACTERS[0]
}
