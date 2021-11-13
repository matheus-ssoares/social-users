import { Request, Response } from 'express';
import { getConnection, getRepository } from 'typeorm';
import users from '../entity/User';
import { UserRegister } from '../interfaces/userInterfaces';
import { hash } from 'bcrypt';
import addresses from '../entity/addresses';
import contacts from '../entity/contacts';
import { validate } from 'class-validator';

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
    const {
      name,
      email,
      birth_date,
      gender,
      image,
      password,
      contact_name,
      phone,
    } = req.body;

    await queryRunner.startTransaction();
    const userRepository = getRepository(users);
    const addressesRepository = getRepository(addresses);
    const contactsRepository = getRepository(contacts);

    const hashPassword = await hash(password ? password : '1', 10);

    const createdUser = userRepository.create({
      name: name,
      email: email,
      birth_date: birth_date,

      gender: gender,
      image: image ? image : '',
      password: hashPassword,
    });
    const userErrors = await validate(createdUser);

    if (userErrors.length > 0) {
      return res.status(400).json(
        userErrors.map((error) => {
          return {
            property: error.property,
            constraints: error.constraints,
          };
        })
      );
    }
    await userRepository.save(createdUser);

    const createdContacts = contactsRepository.create({
      contact_name: contact_name,
      phone: phone,
      user_id: createdUser.id,
    });

    let allErrors = [];

    /* const addressErrors = await validate(createdAddress); */
    const contactsErrors = await validate(createdContacts);

    allErrors = [...userErrors, ...contactsErrors];

    if (allErrors.length > 0) {
      await queryRunner.rollbackTransaction();
      return res.status(400).json(
        allErrors.map((error) => {
          return {
            property: error.property,
            constraints: error.constraints,
          };
        })
      );
    }

    /* await addressesRepository.save(createdAddress); */
    await contactsRepository.save(createdContacts);
    await queryRunner.commitTransaction();
    return res.status(201).send({
      status: 'success',
      createdUser,
    });
  } catch (error: any) {
    await queryRunner.rollbackTransaction();

    if (error.code === PostgresErrorCode.UniqueViolation) {
      return res.status(400).send({
        status: 'failed',
        error: 'User with that email already exists',
      });
    }
    return res.status(400).send({
      status: 'failed',
    });
  } finally {
    await queryRunner.release();
  }
};

interface UpdateProfileImageRequestBody {
  image: string;
  userId: string;
}

export const updateProfileImage = async (
  req: Request<any, any, UpdateProfileImageRequestBody>,
  res: Response
) => {
  const { image, userId } = req.body;

  if (!image) {
    res.status(400).json({ status: 'Error', message: 'image is required' });
  }
  const userRepository = getRepository(users);

  try {
    await userRepository.update(
      { id: userId },
      {
        image,
      }
    );
    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).send({
      status: 'failed',
    });
  }
};
