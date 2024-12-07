import { Request, Response } from "express";
import { generateAccessToken, generateRefreshToken, getUserByEmail } from "@root/services/authentication.service";
import { CustomError } from "@root/utils/customError";
import { handleCustomError } from "@root/utils/handleCustomError";


export class AuthenticationController {

  static login = async (req: Request, res: Response) => {
    const { email, password, remember } = req.body;
    try {
      if (!email || !password) {
        throw new CustomError('Email and password are required.', 400)
      }

      const user = await getUserByEmail(email)
    
      if (user!.password !== password) {
        throw new CustomError('Invalid credentials.', 401)
      }
      const payload = { id: user!.id, email: user!.email }
      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);

      res.cookie('user_id', user!.id, {
        httpOnly: false,
        sameSite: 'lax',
        maxAge: remember ? 30 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000, // if remember == true -> accesible for 30 days : // accesible only for 1 hour
        path: '/'
      })

      res.cookie('access_token', accessToken, {
        httpOnly: true, // cookie is now accesible only by the server 
        sameSite: 'lax',
        maxAge: 60 * 60 * 1000, // accesible only for 1 hour
        path: '/'
      })

      res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: remember ? 30 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000, // if remember == true -> accesible for 30 days : // accesible only for 1 hour
        path: '/'
      })

      res.status(200).json({ message: 'Login successful.', user_category: user.user_category });

    } catch (error) {
      const isErrorHandled = handleCustomError(res, error)
      if (isErrorHandled) return

      res.status(500).json({ message: 'Something went wrong.' });
      throw error
    }

  }
  static register = async (req: Request, res: Response) => {
    res.status(200).json({
      message: "register works"
    })
  }
}