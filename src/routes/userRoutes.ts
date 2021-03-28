import express from 'express'

const userRoutes = express.Router()

import * as userController from '../controllers/userController'

userRoutes.post('/user-register', userController.userRegister)

export default userRoutes