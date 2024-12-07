import { generateAccessToken, getUserById, verifyAccessToken } from "@root/services/authentication.service"
import { CustomError } from "@root/utils/customError"
import { handleCustomError } from "@root/utils/handleCustomError"
import { NextFunction, Request, Response } from "express"

const verifyAuthentication = async (req: Request, res: Response, next: NextFunction) => {

  const accessToken: string = req.cookies.access_token
  const refreshToken: string = req.cookies.refresh_token
  const userId: string = req.cookies.user_id

  try {
    if (!refreshToken || !userId) { // user needs to login again
      throw new CustomError("You need to log in!", 401)
    }

    if (!accessToken) { // if accessToken is missing, we must refresh it
      const user = await getUserById(userId)

      const payload = { id: user!.id, email: user!.email } // TODO: this can be improved
      const AccessToken = await generateAccessToken(payload)
      res.cookie('access_token', AccessToken, {
        httpOnly: true,
        // secure:true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 1000,
        path: '/'
      })
      console.log("token refreshed")
    } else { // if there is a token, we must ensure is a valid one
      await verifyAccessToken(accessToken)
      console.log("valid access token"); // TODO: compare response (user's id)) with the current 'user_id' cookie value
    }
  } catch (error) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    res.clearCookie('userId')

    const isErrorHandled = handleCustomError(res, error)
    if (isErrorHandled) return

    res.status(500).json({
      message: "error when refreshing tokens"
    })
    throw error // unhandled error
  }
  next()
}
export default verifyAuthentication