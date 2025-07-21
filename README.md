# MedCalcHelp

A free, gamified medical calculation practice tool for nurses to learn and master dosage calculations, IV drip rates, unit conversions, and more.

## Features

- 🎲 **Dynamic Question Generation** - Randomized values prevent memorization
- 📝 **Step-by-Step Solutions** - Learn with detailed explanations
- 🏆 **Gamification** - Points, levels, achievements, and leaderboards
- 📊 **Progress Tracking** - Monitor your improvement over time
- 🔥 **Streak System** - Stay motivated with daily practice streaks

## Tech Stack

- **Framework**: TanStack Start (Full-stack React framework)
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based
- **Deployment**: Docker + Coolify

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database
- Docker (for containerized deployment)

### Development Setup

1. Clone the repository
```bash
git clone https://github.com/yourusername/medcalchelp.git
cd medcalchelp
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. Set up the database
```bash
# Start PostgreSQL with Docker Compose
docker-compose up -d postgres

# Run database migrations
npm run db:push

# Seed the database with question templates
# IMPORTANT: Use the complete seed for ALL categories including critical care topics
npm run db:seed:complete

# Alternative seeds (not recommended for production):
# npm run db:seed:expanded  # Missing critical care categories
# npm run db:seed          # Basic seed with minimal data
```

5. Start the development server
```bash
npm run dev
```

Visit http://localhost:3000 to see the application.

### Docker Deployment

1. Build the Docker image
```bash
docker build -t medcalchelp .
```

2. Run with Docker Compose
```bash
docker-compose up -d
```

The application will be available at http://localhost:3000

### Coolify Deployment

1. **Prerequisites**
   - Coolify instance set up
   - PostgreSQL database (can be deployed on Coolify)

2. **Environment Variables**
   Set these in Coolify's environment variables:
   ```
   DATABASE_URL=postgresql://user:password@host:port/database
   JWT_SECRET=your-secure-secret-key
   NODE_ENV=production
   PORT=3000
   ```

3. **Deployment Steps**
   - Create a new resource in Coolify
   - Choose "Docker Compose" deployment
   - Point to your repository
   - Coolify will automatically detect the docker-compose.yml
   - Configure the domain and SSL
   - Deploy!

4. **Database Setup**
   After first deployment, run these commands in Coolify's terminal:
   ```bash
   npm run db:push
   # CRITICAL: Use complete seed to ensure all healthcare categories work
   npm run db:seed:complete
   ```

### Database Management

- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run migrations
- `npm run db:push` - Push schema changes
- `npm run db:studio` - Open Prisma Studio GUI
- `npm run db:seed` - Basic seed (minimal data)
- `npm run db:seed:expanded` - Expanded seed (missing critical care categories)
- `npm run db:seed:complete` - **RECOMMENDED**: Complete seed with ALL healthcare categories

## Project Structure

```
medcalchelp/
├── app/
│   ├── routes/          # Page routes
│   ├── components/      # Reusable UI components
│   ├── lib/            # Utilities and logic
│   │   ├── questions/  # Question generation
│   │   ├── auth/       # Authentication logic
│   │   └── utils/      # Helper functions
│   ├── server/         # Server functions
│   └── styles/         # Global styles
├── prisma/
│   ├── schema.prisma   # Database schema
│   └── seed.ts         # Seed data
├── public/             # Static assets
└── docker-compose.yml  # Docker configuration
```

## Question Categories

⚠️ **IMPORTANT**: Only the `db:seed:complete` script includes ALL categories. The complete seed provides comprehensive coverage across all difficulty levels (Beginner, Intermediate, Expert):

### Core Calculation Categories
- **Dosage Calculations** - Oral medications (tablets, liquids), Injectable medications (IM, SubQ)
- **IV Drip Rates** - Basic drip rates, Micro-drip calculations, Time-based infusions
- **Unit Conversions** - Metric (mg ↔ g ↔ kg), Volume (mL ↔ L), Time conversions
- **Pediatric Dosing** - Weight-based (mg/kg), BSA-based calculations

### Critical Care Categories (⚠️ Only in complete seed)
- **Insulin Dosing** - Sliding scale calculations, Correction factors, Carb coverage
- **Heparin Protocol** - Weight-based boluses, Infusion rates, aPTT-based adjustments
- **Critical Care** - Vasopressor calculations, Dopamine dosing, Titration protocols
- **Reconstitution** - Powder reconstitution, Multi-step dilutions, Complex preparations

### Additional Categories
- **Concentration & Dilution** - Solution concentrations, Dilution ratios
- **Dimensional Analysis** - Multi-step conversions, Complex unit calculations

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.