# Call Break Server

Express + MongoDB backend for the Call Break Score App.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with your MongoDB connection string:
```
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/callbreak?retryWrites=true&w=majority
PORT=5000
```

3. Run the server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Players
- `GET /api/players` - Get all players
- `GET /api/players/:id` - Get single player
- `POST /api/players` - Create player `{ name: string }`
- `PATCH /api/players/:id` - Update player stats
- `DELETE /api/players/:id` - Delete player (only if no matches played)

### Matches
- `GET /api/matches` - Get all matches
- `GET /api/matches/:id` - Get single match
- `POST /api/matches` - Create match
- `PATCH /api/matches/:id` - Update match
- `DELETE /api/matches/:id` - Delete match

### Health
- `GET /api/health` - Server health check

## Deployment

You can deploy this server to:
- Railway
- Render
- Heroku
- DigitalOcean
- Any Node.js hosting platform

Make sure to set the `MONGODB_URI` environment variable in your hosting platform.
