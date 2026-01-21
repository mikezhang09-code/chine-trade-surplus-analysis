# Project Structure

## Directory Layout
```
china-trade-surplus-analysis/
├── frontend/                    # React frontend application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── charts/        # Chart and visualization components
│   │   │   ├── maps/          # Geographic visualization components
│   │   │   ├── ui/            # Basic UI elements (buttons, modals, etc.)
│   │   │   └── layout/        # Layout components (header, footer, sidebar)
│   │   ├── pages/             # Page-level components
│   │   │   ├── Dashboard.tsx  # Main dashboard with overview
│   │   │   ├── Analysis.tsx   # Deep-dive analysis page
│   │   │   ├── Timeline.tsx   # Historical timeline view
│   │   │   └── Comparison.tsx # Comparative analysis page
│   │   ├── hooks/             # Custom React hooks
│   │   │   ├── useTradeData.ts
│   │   │   ├── useChartData.ts
│   │   │   └── useFilters.ts
│   │   ├── services/          # API service functions
│   │   │   ├── api.ts         # Main API client
│   │   │   ├── tradeService.ts
│   │   │   └── dataTransform.ts
│   │   ├── types/             # TypeScript type definitions
│   │   │   ├── trade.ts       # Trade data types
│   │   │   ├── chart.ts       # Chart configuration types
│   │   │   └── api.ts         # API response types
│   │   ├── utils/             # Utility functions
│   │   │   ├── formatters.ts  # Data formatting utilities
│   │   │   ├── calculations.ts # Trade calculations
│   │   │   └── constants.ts   # App constants
│   │   ├── styles/            # Global styles and Tailwind config
│   │   └── assets/            # Static assets (images, icons)
│   ├── public/                # Public assets
│   └── package.json
├── backend/                    # Node.js backend API
│   ├── src/
│   │   ├── controllers/       # Route controllers
│   │   │   ├── tradeController.ts
│   │   │   ├── countryController.ts
│   │   │   └── analyticsController.ts
│   │   ├── models/            # MongoDB data models
│   │   │   ├── Trade.ts       # Trade flow model
│   │   │   ├── Country.ts     # Country data model
│   │   │   └── Sector.ts      # Sector breakdown model
│   │   ├── routes/            # API route definitions
│   │   │   ├── trade.ts
│   │   │   ├── countries.ts
│   │   │   └── analytics.ts
│   │   ├── services/          # Business logic services
│   │   │   ├── dataProcessor.ts
│   │   │   ├── cacheService.ts
│   │   │   └── calculationService.ts
│   │   ├── middleware/        # Express middleware
│   │   │   ├── auth.ts
│   │   │   ├── cors.ts
│   │   │   └── rateLimit.ts
│   │   └── utils/             # Backend utilities
│   └── package.json
├── data/                      # Raw and processed data files
│   ├── raw/                   # Original research files
│   │   ├── china_trade_surplus_study.md
│   │   ├── China-trade-surplus-research-ChatGPT.md
│   │   └── The-Great-Divergence.md
│   ├── processed/             # Cleaned and structured data
│   │   ├── trade_flows.json
│   │   ├── country_data.json
│   │   └── sector_breakdown.json
│   └── scripts/               # Data processing scripts
│       ├── dataExtractor.js
│       ├── dataValidator.js
│       └── seedDatabase.js
├── docs/                      # Documentation
│   ├── api/                   # API documentation
│   ├── deployment/            # Deployment guides
│   └── development/           # Development setup guides
├── .kiro/                     # Kiro CLI configuration
│   ├── steering/              # Project steering documents
│   └── prompts/               # Custom development prompts
└── README.md
```

## File Naming Conventions
**Frontend (React/TypeScript):**
- **Components**: PascalCase (e.g., `TradeFlowChart.tsx`, `CountrySelector.tsx`)
- **Hooks**: camelCase with "use" prefix (e.g., `useTradeData.ts`, `useChartFilters.ts`)
- **Services**: camelCase with descriptive suffix (e.g., `tradeService.ts`, `apiClient.ts`)
- **Types**: PascalCase for interfaces/types (e.g., `TradeData.ts`, `ChartConfig.ts`)
- **Utilities**: camelCase (e.g., `formatCurrency.ts`, `calculateGrowth.ts`)

**Backend (Node.js/Express):**
- **Controllers**: camelCase with "Controller" suffix (e.g., `tradeController.ts`)
- **Models**: PascalCase (e.g., `Trade.ts`, `Country.ts`)
- **Routes**: camelCase (e.g., `trade.ts`, `analytics.ts`)
- **Services**: camelCase with "Service" suffix (e.g., `dataService.ts`)

**Data Files:**
- **Raw data**: snake_case (e.g., `trade_surplus_study.md`)
- **Processed data**: snake_case with descriptive names (e.g., `trade_flows_2025.json`)
- **Scripts**: camelCase (e.g., `processTradeData.js`)

## Module Organization
**Frontend Architecture:**
- **Feature-based organization**: Group related components, hooks, and services by feature
- **Shared components**: Reusable UI components in dedicated folders
- **Custom hooks**: Centralized data fetching and state management logic
- **Service layer**: API communication abstracted from components

**Backend Architecture:**
- **MVC pattern**: Clear separation of models, views (routes), and controllers
- **Service layer**: Business logic separated from route handlers
- **Middleware**: Cross-cutting concerns (auth, logging, validation)
- **Data access layer**: MongoDB models with Mongoose ODM

**Data Processing:**
- **ETL pipeline**: Extract from research documents, Transform to structured format, Load to database
- **Validation layer**: Data quality checks and schema validation
- **Caching strategy**: Redis for frequently accessed calculations and aggregations

## Configuration Files
**Frontend Configuration:**
- `vite.config.ts` - Vite build configuration and plugins
- `tailwind.config.js` - Tailwind CSS customization
- `tsconfig.json` - TypeScript compiler configuration
- `.env.local` - Environment variables (API URLs, feature flags)

**Backend Configuration:**
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration for Node.js
- `.env` - Environment variables (database URLs, API keys)
- `nodemon.json` - Development server configuration

**Development Tools:**
- `.eslintrc.js` - Code linting rules
- `.prettierrc` - Code formatting configuration
- `jest.config.js` - Testing framework configuration
- `.gitignore` - Version control exclusions

## Documentation Structure
**API Documentation:**
- `docs/api/` - OpenAPI/Swagger specifications
- `docs/api/endpoints.md` - Detailed endpoint documentation
- `docs/api/examples.md` - Request/response examples

**Development Documentation:**
- `docs/development/setup.md` - Local development setup
- `docs/development/contributing.md` - Contribution guidelines
- `docs/development/architecture.md` - Technical architecture details

**Deployment Documentation:**
- `docs/deployment/vercel.md` - Vercel deployment guide
- `docs/deployment/database.md` - MongoDB Atlas setup
- `docs/deployment/environment.md` - Environment configuration

## Asset Organization
**Frontend Assets:**
- `src/assets/images/` - Static images (logos, icons, illustrations)
- `src/assets/data/` - Static data files (country codes, color schemes)
- `public/` - Public assets served directly (favicon, manifest)

**Data Assets:**
- `data/raw/` - Original research documents and source materials
- `data/processed/` - Cleaned, structured data ready for visualization
- `data/exports/` - Generated reports and data exports

## Build Artifacts
**Frontend Build:**
- `frontend/dist/` - Production build output (Vite)
- `frontend/coverage/` - Test coverage reports
- `frontend/.cache/` - Build cache files

**Backend Build:**
- `backend/dist/` - Compiled TypeScript output
- `backend/logs/` - Application logs
- `backend/uploads/` - Temporary file uploads (if needed)

## Environment-Specific Files
**Development Environment:**
- `.env.local` (frontend) - Local development variables
- `.env.development` (backend) - Development database and API settings
- `docker-compose.dev.yml` - Local development services (MongoDB, Redis)

**Production Environment:**
- Environment variables configured in Vercel dashboard
- Production database connection strings
- CDN configuration for static assets
- Monitoring and logging service configuration

**Testing Environment:**
- `.env.test` - Test database and mock service configurations
- `jest.config.js` - Test runner configuration
- `cypress.config.js` - End-to-end testing configuration
