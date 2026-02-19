# Farm Inventory Management System

A modern frontend application for managing farm inventory, products, customers, and suppliers. Built with React and Vite.

## Features

- **Authentication**: Login and Signup functionality with secure session management
- **Dashboard**: Overview of farm inventory statistics and key metrics
- **Products Management**: View and manage farm products inventory
- **Customers Management**: Track and manage customer information
- **Suppliers Management**: Manage supplier details and relationships
- **Modern UI**: Clean and responsive interface with Tailwind CSS

## Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Routing**: React Router DOM 7
- **Icons**: FontAwesome
- **Language**: JavaScript (ES6+)

## Project Structure

```
farmInventory/
├── public/                  # Static assets
│   ├── logo.jpeg           # Application logo
│   └── logo1.PNG           # Alternative logo
├── src/
│   ├── Features/
│   │   └── Login.jsx      # Login component
│   ├── Pages/
│   │   ├── Dashboard.jsx  # Main dashboard page
│   │   ├── ProductsPage.jsx # Products management
│   │   ├── Customers.jsx  # Customers management
│   │   ├── SuppliersPage.jsx # Suppliers management
│   │   └── Signup.jsx     # Signup page
│   ├── Store/
│   │   └── authStore.js   # Authentication state (Zustand)
│   ├── App.jsx            # Main application component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── index.html              # HTML template
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
└── eslint.config.js        # ESLint configuration
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```
bash
git clone https://github.com/mueena-12-max/fornt-end.git
```

2. Navigate to the project directory:
```bash
cd farmInventory
```

3. Install dependencies:
```
bash
npm install
```

### Development

Start the development server:
```
bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

Create a production build:
```
bash
npm run build
```

### Preview

Preview the production build:
```
bash
npm run preview
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | Login | Login page |
| `/dashboard` | Dashboard | Main dashboard |
| `/signup` | Signup | Registration page |

## Dependencies

### Production Dependencies

- `@fortawesome/fontawesome-free` - Icon library
- `@fortawesome/react-fontawesome` - React FontAwesome integration
- `react` - Core React library
- `react-dom` - React DOM rendering
- `react-router-dom` - Routing solution
- `tailwindcss` - Utility-first CSS framework
- `zustand` - Small, fast state management

### Development Dependencies

- `@vitejs/plugin-react` - Vite React plugin
- `eslint` - JavaScript linting
- `vite` - Next-generation frontend build tool

## License

This project is for educational purposes.
