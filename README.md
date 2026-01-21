# China Trade Surplus Analysis - Interactive Data Visualization Platform

An interactive data visualization platform showcasing China's historic $1.2 trillion trade surplus in 2025. This educational tool transforms complex economic data into compelling visual narratives, revealing the structural drivers behind this unprecedented trade phenomenon.

## Prerequisites

- Node.js 18+
- Git
- Kiro CLI installed and authenticated
- Modern web browser with WebGL support (for 3D visualizations)

## Quick Start

1. **Clone and setup**
   ```bash
   git clone https://github.com/mikezhang09-code/chine-trade-surplus-analysis.git
   cd chine-trade-surplus-analysis
   cd frontend
   npm install
   ```

2. **Run the application**
   ```bash
   npm run dev
   ```

3. **Access the interface**
   - Web UI: http://localhost:5173
   - Development server with hot reload enabled

## Architecture & Codebase Overview

### System Architecture
- **Frontend**: React 18 with TypeScript and Vite
- **Visualization**: D3.js, Chart.js, Three.js for interactive data visualization
- **Styling**: Tailwind CSS with custom color schemes
- **Data Processing**: Mock services with structured data transformation
- **Testing**: Jest with React Testing Library

### Directory Structure
```
china-trade-surplus-analysis/
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── charts/    # Chart and visualization components
│   │   │   └── maps/      # Geographic visualization components
│   │   ├── pages/         # Main application pages
│   │   ├── hooks/         # Custom React hooks for data management
│   │   ├── services/      # Data processing and mock API services
│   │   ├── types/         # TypeScript type definitions
│   │   └── utils/         # Utility functions
│   └── package.json
├── .agents/               # Development plans and code reviews
├── .kiro/
│   ├── steering/          # Project guidelines and architecture docs
│   └── prompts/           # Custom Kiro development commands
└── data/                  # Research documents and analysis
```

### Key Components
- **Dashboard** (`frontend/src/pages/Dashboard.tsx`): "New Three" exports overview with interactive charts
- **Timeline** (`frontend/src/pages/Timeline.tsx`): Historical trade surplus evolution visualization
- **Geographic Pivot** (`frontend/src/pages/Comparison.tsx`): Regional trade flow analysis and mapping (Geographic Pivot Analysis)
- **3D Globe** (`frontend/src/pages/ThreeVisualization.tsx`): Three.js trade flow visualization (currently disabled)

## Deep Dive

### Data Visualization Features
1. **Interactive Trade Flow Analysis**: Real-time exploration of China's export patterns
2. **"New Three" Exports Dashboard**: EVs, batteries, and solar panels growth visualization
3. **Geographic Pivot Mapping**: Visual representation of trade route shifts from US to Global South
4. **Historical Timeline**: Animated progression of trade surplus from 2010-2025

### Kiro CLI Integration
- **Custom Prompts**: `@prime`, `@plan-feature`, `@execute`, `@code-review` for development workflow
- **Steering Documents**: Comprehensive project guidelines and technical architecture
- **Automated Planning**: Detailed implementation plans for each visualization feature

### Technical Innovations
- **Mock Data Services**: Realistic trade data simulation for development
- **Responsive Design**: Mobile-first approach with progressive enhancement
- **Type-Safe Architecture**: Full TypeScript implementation with strict configuration
- **Component Composition**: Reusable visualization components with consistent APIs

## Development Workflow (Customize this However You Want!)

### Initial Setup (One-Time)
1. **Complete setup**: Run `@quickstart` to configure your project

### Core Development Cycle (Every Feature/Session)

### Phase 1: Setup & Planning
1. **Load context**: Use `@prime` to understand your codebase
2. **Plan features**: Use `@plan-feature` for comprehensive planning

### Phase 2: Build & Iterate
1. **Implement**: Use `@execute` to build features systematically
2. **Review**: Use `@code-review` to maintain code quality
3. **Document**: Update your DEVLOG.md as you work
4. **Optimize**: Customize your `.kiro/` configuration for your workflow

### Phase 3: Submission Preparation
1. **Final review**: Run `@code-review-hackathon` for submission evaluation
2. **Polish documentation**: Ensure README.md and DEVLOG.md are complete
3. **Verify requirements**: Check all submission criteria are met

## Submission Requirements

Your submission will be judged on these criteria (100 points total):

### Application Quality (40 points)
- **Functionality & Completeness** (15 pts): Does it work as intended?
- **Real-World Value** (15 pts): Does it solve a genuine problem?
- **Code Quality** (10 pts): Is the code well-structured and maintainable?

### Kiro CLI Usage (20 points)
- **Effective Use of Features** (10 pts): How well did you leverage Kiro CLI?
- **Custom Commands Quality** (7 pts): Quality of your custom prompts
- **Workflow Innovation** (3 pts): Creative use of Kiro CLI features

### Documentation (20 points)
- **Completeness** (9 pts): All required documentation present
- **Clarity** (7 pts): Easy to understand and follow
- **Process Transparency** (4 pts): Clear development process documentation

### Innovation (15 points)
- **Uniqueness** (8 pts): Original approach or solution
- **Creative Problem-Solving** (7 pts): Novel technical solutions

### Presentation (5 points)
- **Demo Video** (3 pts): Clear demonstration of your project
- **README** (2 pts): Professional project overview

## Required Documentation

Ensure these files are complete and high-quality:

### README.md
- Clear project description and value proposition
- Prerequisites and setup instructions
- Architecture overview and key components
- Usage examples and troubleshooting

*There's a lot of freedom for how you can structure this. Just make sure that it's easy for someone viewing this to know exactly what your project is about and how to run it themselves. This is the main criteria that explains the project clearly and how to test it in a local environment.*

### DEVLOG.md
- Development timeline with key milestones
- Technical decisions and rationale
- Challenges faced and solutions implemented
- Time tracking and Kiro CLI usage statistics

*There's a lot of freedom in how you structure this too. It's up to you how you want to document your timeline, milestones, decisions made, challenges you encounter, and all those kinds of things. Feel free to use Kiro to help you maintain your devlog as you're working on the project. Hint: create a Kiro prompt to help you update your log based on what's happening.*

### .kiro/ Directory
- **Steering documents**: Customized for your project
- **Custom prompts**: Workflow-specific commands
- **Configuration**: Optimized for your development process

*This template provides a good starting point with prompts, and the wizard helps you set up your initial steering documents. However, it's encouraged for you to continue to customize things and refine it as you're working on your project.*

## Available Prompts

This template includes 11 powerful development prompts:

### Core Development
- **`@prime`** - Load comprehensive project context
- **`@plan-feature`** - Create detailed implementation plans
- **`@execute`** - Execute plans with systematic task management
- **`@quickstart`** - Interactive project setup wizard

### Quality Assurance
- **`@code-review`** - Technical code review for quality and bugs
- **`@code-review-hackathon`** - Hackathon submission evaluation
- **`@code-review-fix`** - Fix issues found in code reviews
- **`@system-review`** - Analyze implementation vs plan

### Documentation & Planning
- **`@create-prd`** - Generate Product Requirements Documents
- **`@execution-report`** - Generate implementation reports
- **`@rca`** - Root cause analysis for issues
- **`@implement-fix`** - Implement fixes based on analysis

## Examples

Check the `examples/` folder for:
- **README.md**: Professional project documentation example
- **DEVLOG.md**: Comprehensive development log example

These examples show the level of detail and professionalism expected for hackathon submissions.

## Tips for Success

### Maximize Your Score
1. **Use Kiro CLI extensively** - It's 20% of your score
2. **Document everything** - Process documentation is 20% of your score
3. **Build something useful** - Real-world value is heavily weighted
4. **Optimize your workflow** - Custom prompts and steering documents matter

### Development Best Practices
- **Start with `@quickstart`** to set up your foundation properly
- **Use `@prime`** at the start of every new conversation to quickly catch the coding assistant up to speed on what has been built in the project already
- **Update your DEVLOG.md** continuously, not just at the end
- **Customize your `.kiro/` configuration** as you learn your workflow
- **Run `@code-review-hackathon`** periodically to compare your project against the judging rubric and before submitting

## Troubleshooting

### Common Issues

**Development server won't start**
- Check Node.js version: `node --version` (requires 18+)
- Clear dependencies: `rm -rf node_modules && npm install`
- Verify port 5173 is available

**Charts not rendering**
- Check browser console for JavaScript errors
- Ensure all dependencies are installed: `npm install`
- Verify data services are returning mock data correctly

**3D Globe not working**
- Currently disabled due to WebGL compatibility issues
- Check browser WebGL support: visit `chrome://gpu/`
- Will be re-enabled after WebGL environment fixes

**TypeScript compilation errors**
- Run type checking: `npm run build`
- Check tsconfig.json configuration
- Verify all type definitions are properly imported

### Performance Issues
- **Slow chart rendering**: Reduce data points or implement data sampling
- **Memory usage**: Check for memory leaks in D3.js animations
- **Bundle size**: Analyze with `npm run build` and check output

### Getting Help
- Check browser developer console for errors
- Review Kiro CLI documentation: `/help` in chat
- Open an issue with error details and browser information
