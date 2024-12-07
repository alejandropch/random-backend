import { Response } from "express"
import { CustomError } from "./customError"

export const handleCustomError = (res: Response, error: any) => {
  if (error instanceof CustomError) {
    res.status(error.statusCode).json({
      message: error.message
    })
    return true
  }
  else {
    return false
  }

} 