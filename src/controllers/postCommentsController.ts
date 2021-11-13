import { validate } from 'class-validator';
import { Request, Response } from 'express';
import { getConnection, getRepository } from 'typeorm';
import post_comments from '../entity/post_comments';

export const createPostComment = async (req: Request, res: Response) => {
  const { userId, post_id, comment } = req.body;

  const postCommentsRepository = getRepository(post_comments);

  const connection = getConnection();
  const queryRunner = connection.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  const createdComment = postCommentsRepository.create({
    user_id: userId,
    post_id,
    comment,
  });

  const postCommentErrors = await validate(createdComment);
  if (postCommentErrors.length > 0) {
    return res.status(400).json(
      postCommentErrors.map((error) => {
        return {
          property: error.property,
          constraints: error.constraints,
        };
      })
    );
  }

  try {
    await postCommentsRepository.save(createdComment);

    const findCreatedComment = await postCommentsRepository.findOne({
      where: { id: createdComment.id },
      relations: ['user'],
    });

    await queryRunner.commitTransaction();
    return res.status(201).json({
      ...findCreatedComment,
    });
  } catch (error) {
    await queryRunner.rollbackTransaction();
    return res.status(500).json({ status: 'Error', message: error.detail });
  } finally {
    await queryRunner.release();
  }
};

export const getAllPostComments = async (req: Request, res: Response) => {
  const { id: post_id } = req.params;

  const postCommentsRepository = getRepository(post_comments);

  try {
    const [comments, total] = await postCommentsRepository.findAndCount({
      where: { post_id },
      relations: ['user'],
    });
    return res.status(200).json({
      comments: comments,
    });
  } catch (error) {
    return res.status(500);
  }
};
