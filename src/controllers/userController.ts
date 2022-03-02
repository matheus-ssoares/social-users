import { Jwt, VerifyErrors } from 'jsonwebtoken';
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
import {
  RabbitMqQueues,
  RabbitMqEventTypes,
} from '../interfaces/rabbitMqQueues';
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

    if (password.length === 0) {
      return res
        .status(400)
        .json({ status: 'error', massage: 'Password cannot be empty' });
    }

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

    const rabbitNotificationPayload = {
      name: createdUser.name,
      externalId: createdUser.id,
    };

    sendMessage(
      RabbitMqQueues.SOCIAL_USERS,
      rabbitNotificationPayload,
      RabbitMqEventTypes.USER_CREATED
    );

    return res.status(201).send({
      ...createdUser,
    });
  } catch (error: any) {
    await queryRunner.rollbackTransaction();
    console.log('error');
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
  const id = req.query.id;

  const userRepository = getRepository(users);

  if (!id) {
    return res.status(400).json({ status: 'error', message: 'id is required' });
  }

  const findUser = await userRepository.findOne({ where: { id: id } });

  if (!findUser) {
    return res.status(400).json({ status: 'error', message: 'user not found' });
  }

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
  } catch (e: any) {
    console.error(e);
    res.status(400).json({ error: e.errors.join(', ') });
  }

  try {
    await userRepository.update({ id: findUser.id }, { ...toUpdate });

    const updatedUser = await userRepository.findOne({
      where: { id: findUser.id },
      select: ['id', 'email', 'biography', 'image', 'name'],
    });

    if (updatedUser) {
      const rabbitMqNotification = {
        name: updatedUser.name,
        image: updatedUser.image,
        externalId: updatedUser.id,
      };
      sendMessage(
        RabbitMqQueues.SOCIAL_USERS,
        rabbitMqNotification,
        RabbitMqEventTypes.USER_UPDATED
      );
      return res.json(updatedUser);
    }
  } catch (error) {
    return res.status(500).send({
      status: 'failed',
    });
  }
};
export const getMe = async (req: Request, res: Response) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).send({
      status: 'error',
      message: 'email is required',
    });
  }

  const connection = getConnection();
  const result = await connection
    .getRepository(users)
    .createQueryBuilder('users')
    .where(`users.email = '${email}'`)
    .getOne();

  if (!result) {
    return res.sendStatus(404);
  }

  return res.json({
    ...result,
  });
};
export const getUser = async (req: Request, res: Response) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).send({
      status: 'error',
      message: 'id is required',
    });
  }
  const userRepository = getRepository(users);

  const result = await userRepository.findOne({
    where: { id },
    select: ['id', 'name', 'image', 'biography'],
    relations: ['user_followers', 'user_followers.follower'],
  });

  if (!result) {
    return res.sendStatus(404);
  }

  return res.json({
    ...result,
  });
};
