import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
    Username: Yup.string()
        .required('Name is required')
        .min(3, 'Name must be at least 3 characters long'),
    Password: Yup.string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters long'),
    Name: Yup.string()
        .required('Full name is required'),
    Phone: Yup.string()
        .required('Phone number is required')
        .matches(/^[0-9]+$/, 'Phone number must be digits only')
        .min(10, 'Phone number must be at least 10 digits long'),
    Email: Yup.string()
        .required('Email is required')
        .email('Email is not valid'),
    Tz: Yup.string()
        .required('ID number is required')
        .matches(/^[0-9]+$/, 'ID number must be digits only')
        .min(9, 'ID number must be at least 9 digits long'),
    Id: Yup.number().optional()
});

export default validationSchema;