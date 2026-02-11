// import express from 'express';
// import cors from 'cors';
// import 'dotenv/config';
// import { clerkMiddleware, requireAuth } from '@clerk/express';
// import aiRoutes from "./routes/aiRoutes.js";
// // import userRoutes from './routes/aiRoutes.js';
// // import connectCloudinary from './configs/cloudinary.js';
//   // ✅ Correct ESM import

//   const app = express()
  
//   app.use(express.json())
// // await connectCloudinary();

// app.use(cors());
// // app.use(express.json());
// app.use(clerkMiddleware());

// app.get('/', (req, res) => res.json('server is live!'));
// app.use(requireAuth());

// app.use('/api/ai', aiRoutes);
// // app.use('/api/user', userRoutes);



// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log('server is running on port', PORT);
// });
// import express from 'express';
// import cors from 'cors';
// import 'dotenv/config';
// import { clerkMiddleware, requireAuth } from '@clerk/express';
// import aiRoutes from "./routes/aiRoutes.js";

// const app = express();


// app.use(cors());
// app.use(express.json()); 
// app.use(clerkMiddleware());

// app.get('/', (req, res) => res.json('server is live!'));


// app.use('/api/ai', requireAuth(), aiRoutes);

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log('server is running on port', PORT);
// });

import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { clerkMiddleware, requireAuth } from '@clerk/express';
import aiRoutes from "./routes/aiRoutes.js";
import userRoutes from './routes/aiRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
  // ✅ Correct ESM import

const app = express();
await connectCloudinary();

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

app.get('/', (req, res) => res.json('server is live!'));
app.use(requireAuth());

app.use('/api/ai', aiRoutes);
app.use('/api/user', userRoutes);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('server is running on port', PORT);
});