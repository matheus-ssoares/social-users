import { Request, Response } from 'express';
import user_followers from '../entity/user_followers';
import { getRepository } from 'typeorm';
import { validate } from 'class-validator';
import { getRequestErrors } from '../utils/getRequestErrors';
import * as yup from 'yup';

interface FollowUserRequest {
  follower_id: string;
  user_id: string;
}
interface FollowUserResponse {
  follower_id: string;
  user_id: string;
}

export const followUser = async (
  req: Request<any, any, FollowUserRequest>,
  res: Response
) => {
  const { follower_id, id } = req.query;

  const userFollowersRepository = getRepository(user_followers);

  const validateSchema = yup.object().shape({
    follower_id: yup.string().uuid().required(),
    id: yup.string().uuid().required(),
  });
  try {
    await validateSchema.validate(req.query, {
      stripUnknown: true,
    });
  } catch (e: any) {
    console.error(e);
    res.status(400).json({ error: e.errors.join(', ') });
  }

  const userAlreadyFollow = await userFollowersRepository.findOne({
    where: { follower_id: follower_id, user_id: id },
  });

  if (userAlreadyFollow) {
    return res.status(200).send({
      status: 'this follower already exists',
    });
  }

  try {
    const createdFollower = await userFollowersRepository.create({
      follower_id: String(follower_id),
      user_id: String(id),
    });

    await userFollowersRepository.save(createdFollower);

    res.json(createdFollower);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 'failed',
    });
  }
};

export const unfollowUser = async (
  req: Request<any, any, FollowUserResponse>,
  res: Response
) => {
  const { follower_id, id } = req.query;
  const validateSchema = yup.object().shape({
    follower_id: yup.string().uuid().required(),
    id: yup.string().uuid().required(),
  });

  try {
    await validateSchema.validate(req.query, {
      stripUnknown: true,
    });
  } catch (e: any) {
    console.error(e);
    res.status(400).json({ error: e.errors.join(', ') });
  }
  const userFollowersRepository = getRepository(user_followers);

  const followExists = await userFollowersRepository.findOne({
    where: { follower_id, user_id: id },
  });

  if (!followExists) {
    return res.sendStatus(404);
  }

  try {
    await userFollowersRepository.delete({
      follower_id: String(follower_id),
      user_id: String(id),
    });

    res.sendStatus(200);
  } catch (error) {
    return res.status(500).send({
      status: 'failed',
    });
  }
};
export const getFollow = async (
  req: Request<any, any, FollowUserResponse>,
  res: Response
) => {
  const { follower_id, id } = req.query;
  const validateSchema = yup.object().shape({
    follower_id: yup.string().uuid().required(),
    id: yup.string().uuid().required(),
  });

  try {
    await validateSchema.validate(req.query, {
      stripUnknown: true,
    });
  } catch (e: any) {
    console.error(e);
    res.status(400).json({ error: e.errors.join(', ') });
  }
  const userFollowersRepository = getRepository(user_followers);
  try {
    const findFollow = await userFollowersRepository.findOne({
      follower_id: String(follower_id),
      user_id: String(id),
    });
    if (!findFollow) {
      return res.status(404).json({ status: 'error', message: 'not found' });
    }
    res.json(findFollow);
  } catch (error) {
    return res.status(500).send({
      status: 'failed',
    });
  }
};
