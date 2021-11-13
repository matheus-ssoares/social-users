import { validate } from 'class-validator';
import { Request, Response } from 'express';
import { getConnection, getRepository } from 'typeorm';
import posts from '../entity/posts';
import post_images from '../entity/post_images';
import post_likes from '../entity/post_likes';

interface CreatePostRequestBody {
  content: string;
  post_images: Array<{ image: string }>;
  userId: string;
}

export const createPost = async (
  req: Request<any, any, CreatePostRequestBody>,
  res: Response
) => {
  const connection = getConnection();
  const queryRunner = connection.createQueryRunner();

  await queryRunner.connect();
  try {
    const { content, userId, post_images: postImagesArray } = req.body;

    await queryRunner.startTransaction();

    const postsRepository = getRepository(posts);
    const postImagesRepository = getRepository(post_images);

    const createdPost = postsRepository.create({
      content,
      user_id: userId,
      image: '',
      created_at: new Date(),
      updated_at: new Date(),
    });
    const postsErrors = await validate(createdPost);
    if (postsErrors.length > 0) {
      return res.status(400).json(
        postsErrors.map((error) => {
          return {
            property: error.property,
            constraints: error.constraints,
          };
        })
      );
    }
    await postsRepository.save(createdPost);

    for (let index = 0; index < postImagesArray.length; index++) {
      let imageToSave = postImagesRepository.create({
        image: postImagesArray[index].image,
        post_id: createdPost.id,
      });

      await postImagesRepository.save(imageToSave);
    }

    const post = await postsRepository.find({
      where: { id: createdPost.id },
      relations: [
        'user',
        'post_images',
        'post_likes',
        'post_comments',
        'post_comments.user',
      ],
      order: { created_at: 'DESC' },
    });
    await queryRunner.commitTransaction();
    return res.status(201).json({
      status: 'success',
      post: { ...post[0] },
    });
  } catch (error) {
    await queryRunner.rollbackTransaction();
    return res.status(400).send({
      status: 'failed',
      message: error.detail,
    });
  } finally {
    await queryRunner.release();
  }
};
export const getAllPosts = async (req: Request, res: Response) => {
  const postsRepository = getRepository(posts);
  const { skip } = req.params;

  try {
    //TODO change request to query builder
    const [allPosts, total] = await postsRepository.findAndCount({
      relations: [
        'user',
        'post_images',
        'post_likes',
        'post_likes.user',
        'post_comments',
        'post_comments.user',
      ],
      order: { created_at: 'DESC' },
      skip: Number(skip),
      take: 15,
    });
    const formatedPosts = allPosts.map((post) => {
      return {
        ...post,
        post_comments: post.post_comments.slice(0, 3),
      };
    });

    return res.status(200).json({ posts: formatedPosts, total });
  } catch (error) {
    return res.status(500).json({ status: 'Error', message: 'failed' });
  }
};
interface CreatePostLikeRequestBody {
  userId: string;
  post_id: string;
}

export const createPostLike = async (
  req: Request<any, any, CreatePostLikeRequestBody>,
  res: Response
) => {
  const connection = getConnection();
  const queryRunner = connection.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  try {
    const { userId, post_id } = req.body;
    const postLikesRepository = getRepository(post_likes);

    const likeExists = await postLikesRepository.findOne({
      where: { user_id: userId, post_id },
    });
    if (likeExists) {
      return res.send(400).json({
        status: 'Error',
        message: 'This user has already liked this post',
      });
    }

    const createPostLike = postLikesRepository.create({
      user_id: userId,
      post_id,
    });

    const postLikeErrors = await validate(createPostLike);
    if (postLikeErrors.length > 0) {
      return res.status(400).json(
        postLikeErrors.map((error) => {
          return {
            property: error.property,
            constraints: error.constraints,
          };
        })
      );
    }
    await postLikesRepository.save(createPostLike);
    await queryRunner.commitTransaction();

    const findCreateLike = await postLikesRepository.findOne({
      where: { id: createPostLike.id },
      relations: ['user'],
    });

    res.status(201).json(findCreateLike);
  } catch (error) {
    await queryRunner.rollbackTransaction();
    return res.status(500).json({ status: 'Error', message: 'failed' });
  } finally {
    await queryRunner.release();
  }
};

interface DeletePostLikeRequestBody {
  userId: string;
}
export const deletePostLike = async (
  req: Request<any, any, DeletePostLikeRequestBody>,
  res: Response
) => {
  const { id: post_id } = req.params;
  const { userId } = req.body;

  if (!post_id) {
    res.status(400).json({ status: 'Error', message: 'id is required' });
  }
  const postLikesRepository = getRepository(post_likes);

  const postLike = await postLikesRepository.findOne({
    where: { post_id: post_id, user_id: userId },
  });

  if (!postLike) {
    return res.sendStatus(404);
  }

  const connection = getConnection();
  const queryRunner = connection.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  try {
    postLikesRepository.delete({ post_id, user_id: userId });
    await queryRunner.commitTransaction();
    res.sendStatus(200);
  } catch (error) {
    await queryRunner.rollbackTransaction();
  } finally {
    await queryRunner.release();
  }
};

export const getAllPostLikes = async (req: Request, res: Response) => {
  const { id: post_id } = req.params;

  if (!post_id) {
    res.status(400).json({ status: 'Error', message: 'id is required' });
  }
  const postLikesRepository = getRepository(post_likes);

  try {
    const postLikes = await postLikesRepository.find({
      where: { post_id },
      relations: ['user'],
    });

    res.json(postLikes);
  } catch (error) {
    return res.status(500).json({ status: 'Error' });
  }
};
