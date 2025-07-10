# Overview

This is a full-stack Excel data processing application built with React (frontend) and Express.js (backend). The application allows users to upload Excel files, analyze data, filter columns, and export processed data in various formats. It follows a modern TypeScript-first architecture with a clean separation between client and server code.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management
- **UI Components**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Module System**: ES modules (type: "module")
- **Development**: tsx for TypeScript execution in development
- **Production**: esbuild for server bundling

### Database Architecture
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Shared schema definitions between client and server
- **Migrations**: Drizzle Kit for database migrations
- **Database Provider**: Neon Database (serverless PostgreSQL)

## Key Components

### Data Processing Pipeline
1. **File Upload**: Handles Excel file uploads with validation
2. **Data Analysis**: Processes Excel files using SheetJS (xlsx) library
3. **Column Detection**: Automatically detects data types (text, number, boolean, date)
4. **Field Selection**: Allows users to select specific columns
5. **Data Filtering**: Supports complex filtering conditions
6. **Data Export**: Exports processed data in multiple formats (xlsx, csv, json)

### Frontend Components
- **FileUpload**: Drag-and-drop file upload interface
- **DataAnalysis**: File analysis and column type detection
- **FieldSelection**: Column selection and filtering interface
- **DataPreview**: Paginated data table with filtering preview
- **ExportSection**: Data export with format options
- **ProgressIndicator**: Multi-step workflow progress tracking

### Backend Components
- **Storage Interface**: Abstracted storage layer with in-memory implementation
- **Route Registration**: Modular route handling system
- **Error Handling**: Centralized error middleware
- **Development Tools**: Vite integration for development mode

## Data Flow

1. **File Upload**: User uploads Excel file through drag-and-drop interface
2. **Client Processing**: File is processed client-side using SheetJS
3. **Data Analysis**: Column types are automatically detected
4. **Field Selection**: User selects columns and applies filters
5. **Data Preview**: Filtered data is displayed in paginated table
6. **Export**: Processed data is exported in selected format

## External Dependencies

### Frontend Dependencies
- **@radix-ui/***: Headless UI components for accessibility
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight routing
- **lucide-react**: Icon library
- **tailwindcss**: Utility-first CSS framework
- **xlsx**: Excel file processing
- **file-saver**: File download functionality

### Backend Dependencies
- **express**: Web framework
- **drizzle-orm**: Database ORM
- **@neondatabase/serverless**: Serverless PostgreSQL client
- **connect-pg-simple**: PostgreSQL session store
- **tsx**: TypeScript execution for development

### Development Dependencies
- **vite**: Build tool and development server
- **typescript**: Type checking
- **tailwindcss**: CSS framework
- **@replit/vite-plugin-runtime-error-modal**: Development error handling

## Deployment Strategy

### Development Mode
- Frontend served through Vite development server
- Backend runs with tsx for TypeScript execution
- Hot module replacement enabled for fast development
- Replit-specific development tools integrated

### Production Build
- Frontend built using Vite to static assets
- Backend bundled using esbuild for Node.js
- Static assets served from Express server
- Database migrations applied using Drizzle Kit

### Environment Configuration
- Database connection via DATABASE_URL environment variable
- Neon Database for serverless PostgreSQL hosting
- Session management with PostgreSQL store
- CORS and middleware configuration for production

### File Structure
```
├── client/          # React frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Route components
│   │   ├── lib/         # Utility functions
│   │   └── types/       # TypeScript type definitions
├── server/          # Express backend
│   ├── routes.ts    # API route definitions
│   ├── storage.ts   # Data storage abstraction
│   └── vite.ts      # Development server integration
├── shared/          # Shared code between client/server
│   └── schema.ts    # Database schema definitions
└── migrations/      # Database migration files
```

The application uses a monorepo structure with shared TypeScript types and database schemas, enabling type safety across the full stack while maintaining clear separation of concerns.