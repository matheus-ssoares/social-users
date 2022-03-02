import { Request, Response } from 'express';
import user_followers from '../entity/user_followers';
import { getRepository } from 'typeorm';
import { validate } from 'class-validator';
import { getRequestErrors } from '../utils/getRequestErrors';

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
  const { follower_id, user_id } = req.query;

  if (!user_id) {
    return res
      .status(400)
      .json({ status: 'error', message: 'user_id is required' });
  }
  if (!follower_id) {
    return res
      .status(400)
      .json({ status: 'error', message: 'follower_id is required' });
  }
  const userFollowersRepository = getRepository(user_followers);

  const createdUserFollower = userFollowersRepository.create({
    follower_id: String(follower_id),
    user_id: String(user_id),
  });
  const userErrors = await validate(createdUserFollower);

  getRequestErrors(res, userErrors);

  const userAlreadyFollow = await userFollowersRepository.findOne({
    where: { follower_id: follower_id, user_id: user_id },
  });

  if (userAlreadyFollow) {
    return res.status(200).send({
      status: 'this follower already exists',
    });
  }

  try {
    const createdFollower = await userFollowersRepository.save(
      createdUserFollower
    );

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
  const { follower_id, user_id } = req.body;
  const userFollowersRepository = getRepository(user_followers);

  const followExists = await userFollowersRepository.findOne({
    where: { follower_id, user_id },
  });
  const createdUserFollower = userFollowersRepository.create({
    ...req.body,
  });

  const userErrors = await validate(createdUserFollower);

  getRequestErrors(res, userErrors);

  if (!followExists) {
    return res.sendStatus(404);
  }

  try {
    await userFollowersRepository.delete({ follower_id, user_id });
    res.sendStatus(200);
  } catch (error) {
    return res.status(500).send({
      status: 'failed',
    });
  }
};
