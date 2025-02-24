import '../styles/global.css'
import axios from 'axios';
import { useForm, SubmitHandler } from 'react-hook-form';
import IFormInput from './Repositories/IFormInput';
import IFormInputSignUp from './Repositories/IFormInputSignUp';
import { useNavigate } from 'react-router-dom';
import Recipes from './Recipes';


const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>();
    const navigate = useNavigate();

    const onSubmit: SubmitHandler<IFormInput> = async data => {
        try {
            const response = await axios.post<IFormInputSignUp>('http://localhost:8080/api/user/login', {
                UserName: data.username, // שימוש בנתוני הטופס
                Password: data.password
            });
            // צריך להעביר לקומפוננטת הרשמה

        } catch (error) {
            if (axios.isAxiosError(error)) {
                // נניח שהשרת מחזיר סטטוס 409 אם המשתמש כבר קיים
                if (error.response?.status === 409 ) {
                    console.log('User already exists');
                    navigate('home/')
                } 
                else if(error.response?.status === 401){
                    console.log('User need to sign up');
                    navigate('sign-up/')
                }
                else {
                    console.error('Registration failed:', error.message);
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
                    <label htmlFor="username">Username</label>
                    <input
                        id="username" {...register('username', { required: true })} />
                    {errors.username && <span>This field is required</span>}
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        id="password" type="password" {...register('password', { required: true })} />
                    {errors.password && <span>This field is required</span>}
                </div>
                <button type="submit">Login</button>

                <Recipes/> {/*להוציא את זה זה לא המקום*/ }
            </form>
        </div>
    );
};

export default Login;