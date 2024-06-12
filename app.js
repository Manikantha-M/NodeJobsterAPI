require('dotenv').config();
require('express-async-errors');
const path = require('path');
const express = require('express');
const app = express();
const authRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs');
const authenticateUser = require('./middleware/authentication');
// Extra security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');

// Swagger
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// Connect DB
const {connectToDatabase} = require('./db/connect');
app.set('trust proxy', 1);
app.use(express.static(path.resolve(__dirname, './browser')))
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

// Rate limiter for entire application:
// app.use(rateLimit({
// 	windowMs: 15 * 60 * 1000, // 15 minutes
// 	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
// 	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
// 	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
// 	// store: ... , // Redis, Memcached, etc. See below.
// }));


app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authenticateUser, jobsRouter);

//Ping Route
app.get('*', (req, res)=>{
    res.sendFile(path.resolve(__dirname, './browser'));
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const startServer = async()=>{
    try {
        const connection = await connectToDatabase(process.env.MONGO_URI);
        if(connection){
          console.log('connected to the database');
          app.listen(port, console.log(`server is listening on port ${port}`));
        }
    } catch (error) {
        console.log(error);
    }
}
startServer();