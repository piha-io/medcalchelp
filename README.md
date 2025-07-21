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
# Use the expanded seed for all categories and difficulty levels
npm run db:seed:expanded

# Or use the basic seed for minimal data
# npm run db:seed
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
   # Use the expanded seed for full question coverage
   npm run db:seed:expanded
   ```

### Database Management

- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run migrations
- `npm run db:push` - Push schema changes
- `npm run db:studio` - Open Prisma Studio GUI
- `npm run db:seed` - Seed the database with basic data
- `npm run db:seed:expanded` - Seed the database with all categories and difficulty levels

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

The expanded seed includes comprehensive coverage across all difficulty levels (Beginner, Intermediate, Expert):

- **Dosage Calculations** 
  - Oral medications (tablets, liquids)
  - Injectable medications (IM, SubQ)
  
- **IV Drip Rates**
  - Basic drip rate calculations
  - Micro-drip calculations
  - Time-based infusion problems
  
- **Unit Conversions**
  - Metric conversions (mg ↔ g ↔ kg)
  - Volume conversions (mL ↔ L)
  - Time conversions (minutes ↔ hours)
  
- **Pediatric Dosing**
  - Weight-based calculations (mg/kg)
  - BSA-based calculations
  
- **Concentration & Dilution**
  - Solution concentration calculations
  - Dilution ratio problems
  
- **Dimensional Analysis**
  - Multi-step conversions
  - Complex unit calculations

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.