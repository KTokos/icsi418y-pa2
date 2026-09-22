During development, you will normally have **two terminals open**.

### Terminal 1 – Frontend

From the project root:

```bash
cd client
npm run dev
```

The frontend will normally run at:

```
<http://localhost:5173>
```

### Terminal 2 – Backend

From the project root:

```bash
cd server
node server.js
```

The backend will run at:

```
<http://localhost:9000>
```

These are two separate programs.

```
Browser
   ↓
React
localhost:5173
   ↓
HTTP Requests
   ↓
Express
localhost:9000
```

Later, Express will communicate with MongoDB.