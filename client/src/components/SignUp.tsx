import '../styles/global.css'
import axios from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import IFormInputSignUp from "../repositories/IFormInputSignUp";
import { useNavigate } from 'react-router-dom';
import validationSchema from '../repositories/validationSchema';

const SignUp = () => {
    const navigate = useNavigate()
    const { register, handleSubmit, formState: { errors } } = useForm<IFormInputSignUp>({
        resolver: yupResolver(validationSchema)
    })

    const onSubmit: SubmitHandler<IFormInputSignUp> = async data => {
        console.log('signing up!');
        data = { ...data, Id: 0 };
        console.log(data);

        try {
            const response = await axios.post<IFormInputSignUp>('http://localhost:8080/api/user/signup', data);
            console.log("home page");
            navigate('/home');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log('Axios Registration failed:', error.message);
            } else {
                console.log('Registration failed:', error);
            }
        }
    }

    return (
        <div>
            <h1>איזה כיף שאתם מצטרפים אלינו!</h1>
            <h2>הכניסו את פרטיכם:</h2>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor="Username">שם לאתר שלנו</label>
                    <input id="Username" {...register('UserName')} />
                    {errors.UserName && <small>{errors.UserName.message}</small>}
                </div>

                <div>
                    <label htmlFor="Password">סיסמא</label>
                    <input id="Password" type="Password" {...register('Password')} />
                    {errors.Password && <small>{errors.Password.message}</small>}
                </div>

                <div>
                    <label htmlFor="Name">שם מלא</label>
                    <input id="Name" {...register('Name')} />
                    {errors.Name && <small>{errors.Name.message}</small>}
                </div>

                <div>
                    <label htmlFor="Phone">טלפון</label>
                    <input id="Phone" {...register('Phone')} />
                    {errors.Phone && <small>{errors.Phone.message}</small>}
                </div>

                <div>
                    <label htmlFor="Email">מייל</label>
                    <input id="Email" type="Email" {...register('Email')} />
                    {errors.Email && <small>{errors.Email.message}</small>}
                </div>

                <div>
                    <label htmlFor="Tz">תעודת זהות</label>
                    <input id="Tz" {...register('Tz')} />
                    {errors.Tz && <small>{errors.Tz.message}</small>}
                </div>

                <button type="submit">להרשמה</button>
            </form>
        </div>
    )
}

export default SignUp;
