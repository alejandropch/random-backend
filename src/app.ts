import dotenv from 'dotenv'
dotenv.config()
import express, {Express} from 'express'
import "module-alias/register"
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { authRoute } from './routes/auth.route'
import { dashboardRoute } from './routes/dashboard.route'

process.on('uncaughtException', (error) => {
  console.error(error)
})

const app = express()
const port = process.env.PORT || 3000

// global middlewares
app.use(cors({origin:process.env.FRONTEND_URL, credentials:true}))
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth',authRoute)
app.use('/api/dashboard',dashboardRoute)

app.listen(port, ()=> {
  console.log("listening port:", port);
  
})

