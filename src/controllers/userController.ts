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
  } catch (error) {
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

class UpdateUserDto {
  @IsEmpty()
  @IsString()
  @MaxLength(40)
  name: string;

  @IsEmpty()
  @IsString()
  @MaxLength(240)
  biography: string;
}

var schema = {
  name: {
    type: String,
    required: false,
    length: {
      min: 3,
      max: 36,
    },
  },
  biography: {
    type: String,
    required: false,
    length: {
      min: 3,
      max: 36,
    },
  },
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
    return res.sendStatus(200);
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
    });
    res.json({ total, posts });
  } catch (error) {
    return res.status(500).json({ status: 'Error' });
  }
};
