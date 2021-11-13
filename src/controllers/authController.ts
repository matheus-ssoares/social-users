import { compare } from 'bcrypt';
import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import jwt from 'jsonwebtoken';
import users from '../entity/User';
import * as dotenv from 'dotenv';
dotenv.config();

interface AuthenticateRequestBody {
  email: string;
  password: string;
}
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const authenticate = async (
  req: Request<any, any, AuthenticateRequestBody>,
  res: Response
) => {
  const { email, password } = req.body;

  const userRepository = getRepository(users);

  const user = await userRepository.findOne({ email });

  if (!user) {
    return res.status(404).json({ status: 'Error', message: 'User not found' });
  }
  const isvalid = await compare(password, user.password);

  if (!isvalid) {
    return res
      .status(400)
      .json({ status: 'Error', message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id }, ACCESS_TOKEN_SECRET!, {
    expiresIn: '1d',
  });
  const refreshToken = jwt.sign({ id: user.id }, ACCESS_TOKEN_SECRET!, {
    expiresIn: '20d',
  });
  user.password = '';
  res.send({ ...user, token, refreshToken });
};
export const protect = async (req: Request, res: Response, next: any) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).send({ error: 'No token provided' });

  jwt.verify(
    authHeader,
    ACCESS_TOKEN_SECRET!,
    async (err: any, decoded: any) => {
      if (err) return res.status(401).send({ error: 'Token invalid' });

      req.body.userId = decoded.id;
      return next();
    }
  );
};
