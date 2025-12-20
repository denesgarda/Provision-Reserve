export type ViewType = 'overview' | 'inventory' | 'shopping' | 'planning';

export const VIEW_CONFIG = {
  overview: {
    label: 'Overview',
    icon: '📊',
    description: 'Dashboard and summary of your inventory'
  },
  inventory: {
    label: 'Inventory',
    icon: '📦',
    description: 'Manage your food items and stock levels'
  },
  shopping: {
    label: 'Shopping',
    icon: '🛒',
    description: 'Create and manage shopping lists'
  },
  planning: {
    label: 'Planning',
    icon: '📅',
    description: 'Plan meals and track consumption'
  }
} as const;
