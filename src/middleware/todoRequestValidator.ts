import { checkSchema } from "express-validator";

export const createTodoValidator = checkSchema({
    title: { 
        isString: true, 
        isLength: { 
            options: {
                min: 4, 
                max: 24
            },
            errorMessage: 'Title length must be between 4 and 24'
        }, 
        errorMessage: 'Invalid title' 
    }, description: { 
        isString: true, 
        optional: true,
        isLength: { 
            options: {
                min: 8
            },
            errorMessage: 'Description length must be at least 8'
        }, 
        errorMessage: 'Invalid description'
    }, status: {
        isString: true, 
        optional: true
    }
})

const statusList = ['PENDING', 'COMPLETED', 'NOT COMPLETED'];
export const statusUpdateValidator = checkSchema({
    id: {
        isNumeric: true, 
        errorMessage: 'Id must be a number'
    }, status: { 
        isString: true, 
        isIn: { 
            options: statusList, 
            errorMessage: 'Invalid status' 
        }, errorMessage: 'Status must be a string'
    }
})