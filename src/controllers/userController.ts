import { Request, Response } from 'express'
import { getRepository } from 'typeorm';
import users from '../entity/User'
import { IUserRegister } from '../interfaces/userInterfaces'
import { hash } from 'bcrypt'
import addresses from '../entity/addresses';
import contacts from '../entity/contacts';

export const userRegister = async (req: Request<any, any, IUserRegister>, res: Response) => {
    try {
        const { name, email, birth_date, document, gender, image, password, address_title, zip_code, country, state, city, neighborhood, contact_name, phone } = req.body

        const userRepository = getRepository(users);
        const addressesRepository = getRepository(addresses);
        const contactsRepository = getRepository(contacts);

        const hashPassword = await hash(password, 10)

        const createdUser = await userRepository.create({ name: name, email: email, birth_date: birth_date, document: document, gender: gender, image: image, password: hashPassword })
        await userRepository.save(createdUser);
        const createdAddress = await addressesRepository.create({ country: country, state: state, city: city, neighborhood: neighborhood, zip_code: zip_code, address_title: address_title, user_id: createdUser.id })
        const createdContacts = await contactsRepository.create({ contact_name: contact_name, phone: phone, user_id: createdUser.id })


        await addressesRepository.save(createdAddress)
        await contactsRepository.save(createdContacts)
        return res.status(201).send({
            status: 'sucess',
            createdUser
        })
    } catch (error) {
        console.log(error)
        return res.status(400).send({
            status: 'failed',
        })
    }
}

