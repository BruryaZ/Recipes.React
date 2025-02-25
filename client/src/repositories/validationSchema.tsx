import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
    UserName: Yup.string()
        .required('שם הוא חובה')
        .min(3, 'שם חייב להיות באורך של לפחות 3 תווים'),
    Password: Yup.string()
        .required('סיסמה היא חובה')
        .min(6, 'סיסמה חייבת להיות באורך של לפחות 6 תווים'),
    Name: Yup.string()
        .required('שם מלא הוא חובה'),
    Phone: Yup.string()
        .required('מספר טלפון הוא חובה')
        .matches(/^[0-9]+$/, 'מספר טלפון חייב להיות רק מספרים')
        .min(10, 'מספר טלפון חייב להיות באורך של לפחות 10 מספרים'),
    Email: Yup.string()
        .required('אימייל הוא חובה')
        .email('האימייל אינו תקין'),
    Tz: Yup.string()
        .required('מספר תעודת זהות הוא חובה')
        .matches(/^[0-9]+$/, 'מספר תעודת זהות חייב להיות רק מספרים')
        .min(9, 'מספר תעודת זהות חייב להיות באורך של לפחות 9 מספרים'),
    Id: Yup.number().optional()
});

export default validationSchema;
