# Trading Dashboard

Real-time monitoring dashboard for the Sector Rotation Trading Bot. Displays live trading data, performance metrics, and bot statistics.

## 🎯 Overview

This frontend dashboard connects to the [trading bot's](https://github.com/iLovePizzaDC/tradingbotv2) output data and visualizes:

- Portfolio performance
- Trade history and analysis
- Position tracking
- Market regime information
- Decision logging and rebalance history

## 🏗️ Architecture

### Folder Structure

```
src/
├── app/
│   ├── App.tsx          # Main app layout
│   └── index.css        # Global styles
├── features/            # Feature modules (self-contained)
│   └── [feature]/
│       ├── components/
│       │   ├── atoms/   # Smallest UI elements
│       │   ├── molecules/ # Composite components
│       │   └── organisms/ # Complete feature sections
│       ├── types/       # Feature-specific types (optional)
│       ├── utils/       # Feature-specific utilities (optional)
│       └── constants/   # Feature-specific constants (optional)
├── shared/
│   ├── api/             # Data fetching functions
│   ├── components/
│   │   └── atoms/       # Reusable atomic components
│   ├── hooks/           # Custom React hooks
│   └── types/           # Global type definitions
└── main.tsx             # Entry point
```

### Design Pattern: Atomic Design

Components are organized by size/complexity:

- **Atoms**: Basic, reusable elements (buttons, cards, inputs)
- **Molecules**: Simple combinations of atoms
- **Organisms**: Complete feature sections using atoms/molecules

### Key Files

- `src/shared/api/` - All data fetching logic
- `src/shared/hooks/` - Reusable hooks (useFetch, useExpandable, etc.)
- `src/shared/types/` - Global TypeScript types
- `src/app/App.tsx` - Main layout and routing

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Lint
npm run lint
```

## 💻 Technologies

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool & dev server
- **Papa Parse** - CSV parsing (for parsing bot data)

## 📊 Data Integration

The dashboard fetches data from an external data source (typically `/data/` directory served by a web server).

### Adding Data Sources

1. **Define a type** in `src/shared/types/`

```typescript
// src/shared/types/my-feature.ts
export interface MyData {
	date: string;
	value: number;
}
```

2. **Create fetch function** in `src/shared/api/data.ts`

```typescript
export async function fetchMyData(): Promise<MyData[]> {
	const res = await fetch('/data/my-file.json');
	return res.json();
}
```

3. **Use in component** with the `useFetch` hook

```typescript
import { useFetch } from '@/shared/hooks/useFetch';
import { fetchMyData } from '@/shared/api/data';

function MyComponent() {
  const { data, loading, error } = useFetch(fetchMyData);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;

  return <div>{/* render data */}</div>;
}
```

## 🎨 Adding Features

### Create a New Feature

```bash
# Create feature folder structure
mkdir -p src/features/my-feature/components/{atoms,molecules,organisms}
mkdir src/features/my-feature/types
mkdir src/features/my-feature/utils
```

### File Template: Feature Component

```typescript
// src/features/my-feature/components/organisms/MyFeature.tsx
import { useFetch } from '@/shared/hooks/useFetch';
import { fetchMyData } from '@/shared/api/data';

export function MyFeature() {
  const { data, loading, error } = useFetch(fetchMyData);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-4">
      {/* Render feature */}
    </section>
  );
}

export default MyFeature;
```

### Add Feature to App

Edit `src/app/App.tsx`:

```typescript
import MyFeature from '@/features/my-feature/components/organisms/MyFeature';

function App() {
  return (
    <main className='min-h-screen p-4 md:p-8'>
      <div className='mx-auto max-w-7xl space-y-4'>
        <MyFeature />
        {/* Other features */}
      </div>
    </main>
  );
}
```

## 🧩 Shared Components

Reusable UI atoms in `src/shared/components/atoms/`:

- Use these components across features for consistency
- Example: buttons, cards, badges, loading states

When creating a new atom:

```typescript
// src/shared/components/atoms/MyButton.tsx
interface MyButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export function MyButton({ children, onClick }: MyButtonProps) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
    >
      {children}
    </button>
  );
}
```

## 🪝 Custom Hooks

Located in `src/shared/hooks/`:

### useFetch

Generic hook for data fetching with loading/error states:

```typescript
const { data, loading, error } = useFetch(fetchFunction);
```

### useExpandable

Manage expandable/collapsible sections:

```typescript
const { isExpanded, toggle } = useExpandable();
```

## 🎯 Best Practices

1. **Keep components small** - Each organism should focus on one feature
2. **Use TypeScript** - Define types for all data and props
3. **Reuse atoms** - Use existing atoms instead of creating new ones
4. **Centralize data fetching** - All fetch functions in `src/shared/api/`
5. **Responsive design** - Use Tailwind's responsive classes (md:, lg:, etc.)

## 🔧 Styling

- **Framework**: Tailwind CSS
- **Responsive**: Mobile-first approach with `md:`, `lg:` breakpoints
- **Theme**: Customize in Tailwind config if needed

## 📦 Building & Deployment

```bash
# Production build
npm run build

# Output: dist/ directory
```

Serve the `dist/` folder with a web server (Nginx, Apache, etc.).

Ensure data endpoint (usually `/data/`) is accessible from the web server.

## 📚 Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/)
- [Atomic Design Methodology](https://atomicdesign.bradfrost.com/)

---

**Dashboard for [Sector Rotation Trading Bot](https://github.com/iLovePizzaDC/tradingbotv2)**
