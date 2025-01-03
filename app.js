import cookieParser from 'cookie-parser';
import express from 'express';
import { config } from 'dotenv';
config();
import morgan from 'morgan';
import errorMiddleware from './middlewares/error.middleware.js';
import cors from 'cors'
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Use the cors middleware
const corsOptions = {
  origin: 'https://gtams-frontend.vercel.app',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Allow cookies to be sent with requests
  allowedHeaders: ['Content-Type', 'Authorization'] // Adjust headers as needed
};

// Use the cors middleware with the specified options
app.use(cors(corsOptions));


// app.use((req, res, next) => {

//   res.header('Access-Control-Allow-Origin', 'https://gtams-frontend.vercel.app');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS ,PATCH');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   res.header('Access-Control-Allow-Credentials', 'true');

//   // Handle preflight requests
//   if (req.method === 'OPTIONS') {
//     res.sendStatus(200);
//   } else {
//     next();
//   }
// });


app.use(morgan('dev'));
app.use(cookieParser());



app.get('/', (req, res) => {
  res.send('Hello World!');
});
// Server Status Check Route
app.get('/ping', (_req, res) => {
  res.send('Pong');
});



// Import all routes
import userRoutes from './routes/user.routes.js';
import courseRoutes from './routes/course.routes.js';
import miscRoutes from './routes/miscellaneous.routes.js';
import applicationRoutes from './routes/application.routes.js';
import formRoutes from './routes/form.routes.js';
import departmentRoutes from './routes/department.routes.js';
import evaluationRoutes from './routes/evaluation.routes.js';


app.use('/api/v1/user', userRoutes);
app.use('/api/v1/course', courseRoutes);
app.use('/api/v1/application', applicationRoutes);
app.use('/api/v1', miscRoutes);
app.use('/api/v1/form', formRoutes)
app.use('/api/v1/department', departmentRoutes)
app.use('/api/v1/evaluation', evaluationRoutes)


app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});



// Default catch all route - 404
app.all('*', (_req, res) => {
  res.status(404).send('OOPS!!! 404 Page Not Found');
});

// Custom error handling middleware
app.use(errorMiddleware);

export default app;
