import { Request, Response } from 'express';
import { getConnection, getRepository } from 'typeorm';
import users from '../entity/User';
import { UserRegister } from '../interfaces/userInterfaces';
import { hash } from 'bcrypt';
import addresses from '../entity/addresses';
import contacts from '../entity/contacts';
import { validate, IsString, MaxLength, IsEmpty } from 'class-validator';
import * as yup from 'yup';
import posts from '../entity/posts';
import { getRequestErrors } from '../utils/getRequestErrors';
import { RabbitMqQueues } from '../utils/rabbitMqQueues';
import { sendMessage } from '../modules/rabbitMq';

enum PostgresErrorCode {
  UniqueViolation = '23505',
  CheckViolation = '23514',
  NotNullViolation = '23502',
  ForeignKeyViolation = '23503',
}

export const userRegister = async (
  req: Request<any, any, UserRegister>,
  res: Response
) => {
  const connection = getConnection();
  const queryRunner = connection.createQueryRunner();

  await queryRunner.connect();
  try {
    const { name, email, birth_date, gender, image, password, phone } =
      req.body;

    await queryRunner.startTransaction();
    const userRepository = getRepository(users);
    const contactsRepository = getRepository(contacts);

    const hashPassword = await hash(password, 10);

    const createdUser = userRepository.create({
      name: name,
      email: email,
      birth_date: birth_date,

      gender: gender,
      image: image ? image : '',
      password: hashPassword,
    });
    const userErrors = await validate(createdUser);

    getRequestErrors(res, userErrors);

    await userRepository.save(createdUser);

    const createdContacts = contactsRepository.create({
      contact_name: 'Principal',
      phone: phone,
      user_id: createdUser.id,
    });

    let allErrors = [];

    const contactsErrors = await validate(createdContacts);

    allErrors = [...userErrors, ...contactsErrors];

    getRequestErrors(res, allErrors);

    await contactsRepository.save(createdContacts);
    await queryRunner.commitTransaction();

    sendMessage(RabbitMqQueues.USER_REGISTER, createdUser);

    return res.status(201).send({
      ...createdUser,
    });
  } catch (error) {
    await queryRunner.rollbackTransaction();

    if (error.code === PostgresErrorCode.UniqueViolation) {
      return res.status(400).send({
        status: 'failed',
        message: 'User with that email already exists',
      });
    }
    return res.status(400).send({
      status: 'failed',
    });
  } finally {
    await queryRunner.release();
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const userId = req.body.userId;

  const userRepository = getRepository(users);

  //TODO change image updload to multer
  const validateSchema = yup.object().shape({
    name: yup.string().optional(),
    biography: yup.string().optional(),
    image: yup.string().optional(),
  });
  let toUpdate;
  try {
    toUpdate = await validateSchema.validate(req.body, {
      stripUnknown: true,
    });
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: e.errors.join(', ') });
  }

  try {
    await userRepository.update({ id: userId }, { ...toUpdate });

    const updatedUser = await userRepository.findOne({ where: { id: userId } });

    if (updatedUser) {
      delete updatedUser.password;
      return res.json(updatedUser);
    }
  } catch (error) {
    return res.status(500).send({
      status: 'failed',
    });
  }
};

export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).send({
      status: 'error',
      message: 'id is required',
    });
  }

  const connection = getConnection();
  const result = await connection
    .getRepository(users)
    .createQueryBuilder('users')
    .where(`users.id = '${id}'`)
    .getOne();

  if (!result) {
    return res.sendStatus(404);
  }

  return res.json({
    ...result,
  });
};

export const getPostsByUser = async (req: Request, res: Response) => {
  const { id, skip } = req.params;

  if (!id || !skip) {
    return res
      .status(400)
      .json({ status: 'Error', message: 'missing required params' });
  }

  const postsRepository = getRepository(posts);

  try {
    const [posts, total] = await postsRepository.findAndCount({
      where: { user_id: id },
      relations: [
        'user',
        'post_images',
        'post_likes',
        'post_likes.user',
        'post_comments',
        'post_comments.user',
      ],
      skip,
      take: 15,
      order: { created_at: 'DESC' },
    });
    res.json({ total, posts });
  } catch (error) {
    return res.status(500).json({ status: 'Error' });
  }
};
