import { PrismaClient } from '@prisma/client';
import { CustomError } from '@root/utils/customError';
import jwt, { JwtPayload } from 'jsonwebtoken';

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET
const prisma = new PrismaClient()

export const getUserByEmail = async (email: string) => {
  try {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: email },
    });
    if (!user) throw new CustomError("User does not exists", 404)
    return user
  } catch (err) {
    throw err
  }

}

export const getUserById = async (id: string) => {
  // Check if user exists
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user) throw new CustomError("User does not exists", 404)
    return user
  } catch (err) {
    throw err
  }
}


export const generateAccessToken = (payload: object): string => {
  return jwt.sign(payload, accessTokenSecret!, {
    expiresIn: '1h',
  });
};

export const generateRefreshToken = (payload: object): string => {
  return jwt.sign(payload, refreshTokenSecret!, {
    expiresIn: '30d',
  });
};


export const verifyAccessToken = (token: string): JwtPayload | string => {
  try {
    return jwt.verify(token, accessTokenSecret!);
  } catch (err) {
    throw new CustomError("Invalid Access Token", 400)
  }
}