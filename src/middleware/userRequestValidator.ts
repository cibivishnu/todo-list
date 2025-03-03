import { checkSchema } from "express-validator";

export const createUserValidator = checkSchema({
    name: {
        isString: true, 
        isLength: {
            options: {
                min: 4, 
                max: 24
            },
            errorMessage: 'Name must be between 4 and 24 characters'
        },
        errorMessage: 'Name must be a string'        
    }
})