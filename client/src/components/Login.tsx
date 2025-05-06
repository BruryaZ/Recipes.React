import '../styles/global.css';
import axios from 'axios';
import { useForm, SubmitHandler } from 'react-hook-form';
import IFormInput from '../repositories/IFormInput';
import { useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { detailsContext } from '../context/Provider';
import { User } from '../repositories/User';
import {
    Box,
    Button,
    TextField,
    Typography,
    Stack,
    Alert,
    Paper,
} from '@mui/material';

const Login = ({ isDarkMode }: { isDarkMode: boolean }) => {
    const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>();
    const navigate = useNavigate();
    const detailsContextProvider = useContext(detailsContext);
    const [loginError, setLoginError] = useState('');

    const onSubmit: SubmitHandler<IFormInput> = async user => {
        try {
            setLoginError('');            
            const { data } = await axios.post<User>('http://localhost:8080/api/user/login', user);
            detailsContextProvider.setMyId(data.Id);
            detailsContextProvider.setMyName(data.Name);
            detailsContextProvider.setMyEmail(data.Email);
            detailsContextProvider.setMyPassword(data.Password);
            navigate('/');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 409) {
                    navigate('/home');
                } else if (error.response?.status === 401) {
                    navigate('/sign-up');
                } else {
                    setLoginError('שגיאה בהתחברות. נסה שוב.');
                }
            }
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundColor: isDarkMode ? '#333' : '#fff',
                color: isDarkMode ? '#fff' : '#000',
                padding: 4,
            }}
            dir="rtl"
        >
            <Paper
                elevation={4}
                sx={{
                    width: '100%',
                    maxWidth: 400,
                    padding: 4,
                    borderRadius: 3,
                    backgroundColor: isDarkMode ? '#424242' : '#f9f9f9',
                }}
            >
                <Typography variant="h4" align="center" gutterBottom sx={{ fontFamily: 'inherit' }}>
                    ברוכים הבאים לאתר המתכונים!
                </Typography>
                <Typography variant="h6" align="center" gutterBottom sx={{ fontFamily: 'inherit' }}>
                    התחברות
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Stack spacing={3}>
                        <TextField
                            label="שם משתמש"
                            fullWidth
                            {...register('UserName', {
                                required: 'שדה חובה',
                                minLength: {
                                    value: 3,
                                    message: 'לפחות 3 תווים',
                                },
                            })}
                            error={!!errors.UserName}
                            helperText={errors.UserName?.message}
                            InputLabelProps={{ style: { fontFamily: 'inherit' } }}
                            inputProps={{
                                dir: 'rtl',
                                style: {
                                    fontFamily: 'inherit',
                                    textAlign: 'right',
                                },
                            }}
                        />

                        <TextField
                            label="סיסמה"
                            type="password"
                            fullWidth
                            {...register('Password', {
                                required: 'שדה חובה',
                                minLength: {
                                    value: 6,
                                    message: 'לפחות 6 תווים',
                                },
                            })}
                            error={!!errors.Password}
                            helperText={errors.Password?.message}
                            InputLabelProps={{ style: { fontFamily: 'inherit' } }}
                            inputProps={{
                                dir: 'rtl',
                                style: {
                                    fontFamily: 'inherit',
                                    textAlign: 'right',
                                },
                            }}
                        />

                        {loginError && <Alert severity="error">{loginError}</Alert>}

                        <Button variant="contained" color="primary" fullWidth type="submit">
                            התחבר
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Box>
    );
};

export default Login;