import '../styles/global.css'
import axios from 'axios';
import { useForm, SubmitHandler } from 'react-hook-form';
import IFormInput from '../repositories/IFormInput';
import IFormInputSignUp from '../repositories/IFormInputSignUp';
import { useNavigate } from 'react-router-dom';
import Recipes from './Recipes';
import Header from './Dashboard';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>();
    const navigate = useNavigate();

    const onSubmit: SubmitHandler<IFormInput> = async data => {
        try {
            console.log( data.Name+" "+ data.Password);
            
            const response = await axios.post<IFormInput>('http://localhost:8080/api/user/login', {
                Name: data.Name, // שימוש בנתוני הטופס
                Password: data.Password
            }
            );
            navigate('home/')

            // צריך להעביר לקומפוננטת הרשמה
        } catch (error) {
            if (axios.isAxiosError(error)) {
                // נניח שהשרת מחזיר סטטוס 409 אם המשתמש כבר קיים
                if (error.response?.status === 409) {
                    console.log('User already exists');
                    navigate('home/')
                }
                else if (error.response?.status === 401) {
                    console.log('User need to sign up');
                    navigate('sign-up/')
                }
                else {
                    console.log('Registration failed:', error.message);
                }
            }
        }
    };

    return (
        <div>
            <h1>ברוכים הבאים לאתר המתכונים!</h1>
            <h2>הירשמו כדי לטעום:</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor="UserName">שם משתמש</label>
                    <input
                        id="Name" {...register('Name', { required: true })} />
                    {errors.Name && <small>שדה חובה</small>}
                </div>
                <div>
                    <label htmlFor="Password">סיסמא</label>
                    <input
                        id="Password" type="password" {...register('Password', { required: true })} />
                    {errors.Password && <small>שדה חובה</small>}
                </div>
                <button type="submit">כניסה למערכת</button>

                <Recipes /> {/*להוציא את זה זה לא המקום*/}
            </form>
        </div>
    );
};

export default Login;