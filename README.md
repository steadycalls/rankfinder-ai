# RankFinder AI

> Find Your $10K/Month Rank & Rent Opportunity in Minutes

RankFinder AI is an AI-powered niche research tool that helps rank and rent entrepreneurs identify profitable, low-competition opportunities by analyzing thousands of niche/location combinations instantly.

![RankFinder AI](https://img.shields.io/badge/Status-Active-success)
![License](https://img.shields.io/badge/License-MIT-blue)

## 🚀 Features

- **AI-Powered Analysis**: Leverage advanced AI to analyze 100+ local service niches across any location
- **Comprehensive Reports**: Get detailed insights including:
  - Opportunity Score (1-100)
  - Search volume and CPC data
  - 20+ target keywords with difficulty scores
  - Top 5 competitor analysis with domain authority
  - Available domain suggestions
  - Monthly revenue projections
- **Credit-Based System**: Purchase report credits and generate analyses on demand
- **User Dashboard**: Track your credits, view reports, and manage your research
- **Modern UI**: Clean, responsive interface built with React and Tailwind CSS

## 💡 Value Proposition

**$49 Investment → $500+ Value → Unlimited Potential**

- **Save 20-40 hours** of manual research per niche
- **Identify opportunities** that can generate $1,500-$5,000/month
- **Avoid costly mistakes** by finding low-competition niches before investing

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS 4, Wouter
- **Backend**: Express 4, tRPC 11, Node.js
- **Database**: MySQL/TiDB with Drizzle ORM
- **AI**: Integrated LLM for intelligent niche analysis
- **Auth**: Manus OAuth
- **UI Components**: shadcn/ui

## 📋 Prerequisites

- Node.js 22.x or higher
- pnpm package manager
- MySQL/TiDB database
- Manus platform account (for OAuth and AI services)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/steadycalls/rankfinder-ai.git
cd rankfinder-ai
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Environment Variables

The following environment variables are automatically injected by the Manus platform:

- `DATABASE_URL` - MySQL/TiDB connection string
- `JWT_SECRET` - Session cookie signing secret
- `VITE_APP_ID` - Manus OAuth application ID
- `OAUTH_SERVER_URL` - Manus OAuth backend URL
- `VITE_OAUTH_PORTAL_URL` - Manus login portal URL
- `BUILT_IN_FORGE_API_URL` - Manus built-in APIs endpoint
- `BUILT_IN_FORGE_API_KEY` - API key for Manus services
- `VITE_APP_TITLE` - Application title
- `VITE_APP_LOGO` - Application logo URL

### 4. Initialize Database

```bash
pnpm db:push
```

### 5. Start Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
rankfinder-ai/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── pages/         # Page components
│   │   │   ├── Home.tsx           # Landing page
│   │   │   ├── Dashboard.tsx      # User dashboard
│   │   │   ├── Reports.tsx        # Reports list
│   │   │   └── ReportDetail.tsx   # Individual report view
│   │   ├── components/    # Reusable UI components
│   │   ├── lib/          # Client utilities
│   │   └── index.css     # Global styles
├── server/                # Backend Express + tRPC
│   ├── routers.ts        # tRPC API routes
│   ├── db.ts             # Database queries
│   ├── nicheAnalysis.ts  # AI niche analysis logic
│   └── _core/            # Framework core
├── drizzle/              # Database schema and migrations
│   └── schema.ts         # Database tables
└── shared/               # Shared types and constants
```

## 🎯 How It Works

### 1. Choose Your Niche & Location
Select from 100+ local service niches (plumbing, HVAC, roofing, legal services, etc.) and enter your target city or region.

### 2. AI Analyzes the Opportunity
The AI evaluates:
- Search volume for relevant keywords
- Cost-per-click (CPC) data to estimate lead value
- Competition levels and difficulty
- Local business density
- Revenue potential

### 3. Get Your Detailed Report
Receive a comprehensive analysis with:
- Overall opportunity score
- Target keywords with search volume and difficulty
- Competitor analysis with domain authority
- Available domain name suggestions
- Monthly revenue projections

## 📊 Database Schema

### Users Table
- User authentication and profile information
- Role-based access control (user/admin)

### Credits Table
- Tracks available report credits per user
- Updated on purchase and usage

### Reports Table
- Stores generated niche analyses
- Includes all analysis data (keywords, competitors, domains, projections)

## 🔧 Development

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm db:push` - Push database schema changes
- `pnpm db:studio` - Open Drizzle Studio for database management

### Adding New Niches

Edit `server/nicheAnalysis.ts` and add new niches to the `NICHES` array:

```typescript
export const NICHES = [
  "Plumbing",
  "HVAC",
  "Your New Niche",
  // ...
];
```

### Customizing AI Analysis

The AI analysis prompt can be customized in `server/nicheAnalysis.ts` in the `analyzeNiche` function. Adjust the prompt to change how the AI evaluates opportunities.

## 🚢 Deployment

This application is designed to be deployed on the Manus platform, which provides:
- Automatic environment variable injection
- Built-in OAuth authentication
- AI service integration
- Database hosting
- One-click deployment

To deploy:
1. Create a checkpoint in the Manus interface
2. Click the "Publish" button
3. Your application will be live with a custom domain

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with [Manus AI](https://manus.im)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev)

## 📞 Support

For questions or support, please open an issue on GitHub.

---

**Made with ❤️ for the rank and rent community**

