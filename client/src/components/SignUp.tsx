import '../styles/global.css';
import axios from 'axios';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { detailsContext } from '../context/Provider';

import {
    Box,
    Button,
    TextField,
    Typography,
    Stack,
    Alert,
    Paper,
} from '@mui/material';
import { UserSignUp, UserSignUpRes } from '../repositories/IFormInputSignUp';

const SignUp = ({ isDarkMode }: { isDarkMode: boolean }) => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm<UserSignUp>();
    const detailsContextProvider = useContext(detailsContext);
    const [signUpError, setSignUpError] = useState('');

    const onSubmit: SubmitHandler<UserSignUp> = async user => {
        setSignUpError('');
        try {
            console.log("User: ", user);
            
            const { data } = await axios.post<UserSignUpRes>('http://localhost:8080/api/user/sighin', user);
            detailsContextProvider.setMyId(data.Id);
            detailsContextProvider.setMyName(data.Name);
            detailsContextProvider.setMyEmail(data.Email);
            detailsContextProvider.setMyPassword(data.Password);
            navigate('/');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setSignUpError('שגיאה בהרשמה. נסו שוב.');
            } else {
                setSignUpError('אירעה שגיאה כללית.');
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
                    maxWidth: 500,
                    padding: 4,
                    borderRadius: 3,
                    backgroundColor: isDarkMode ? '#424242' : '#f9f9f9',
                }}
            >
                <Typography variant="h4" align="center" gutterBottom sx={{ fontFamily: 'inherit' }}>
                    איזה כיף שאתם מצטרפים אלינו!
                </Typography>
                <Typography variant="h6" align="center" gutterBottom sx={{ fontFamily: 'inherit' }}>
                    הכניסו את פרטיכם:
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Stack spacing={3}>
                        <TextField
                            label="שם משתמש"
                            fullWidth
                            {...register('UserName', {
                                required: 'שדה חובה',
                                minLength: { value: 3, message: 'לפחות 3 תווים' },
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
                                minLength: { value: 6, message: 'לפחות 6 תווים' },
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

                        <TextField
                            label="שם מלא"
                            fullWidth
                            {...register('Name', {
                                required: 'שדה חובה',
                            })}
                            error={!!errors.Name}
                            helperText={errors.Name?.message}
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
                            label="טלפון"
                            fullWidth
                            {...register('Phone', {
                                required: 'שדה חובה',
                                pattern: {
                                    value: /^[0-9]{9,10}$/,
                                    message: 'מספר טלפון לא תקין',
                                },
                            })}
                            error={!!errors.Phone}
                            helperText={errors.Phone?.message}
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
                            label="מייל"
                            fullWidth
                            type="email"
                            {...register('Email', {
                                required: 'שדה חובה',
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: 'כתובת מייל לא תקינה',
                                },
                            })}
                            error={!!errors.Email}
                            helperText={errors.Email?.message}
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
                            label="תעודת זהות"
                            fullWidth
                            {...register('Tz', {
                                required: 'שדה חובה',
                                pattern: {
                                    value: /^[0-9]{9}$/,
                                    message: 'מספר זהות לא תקין',
                                },
                            })}
                            error={!!errors.Tz}
                            helperText={errors.Tz?.message}
                            InputLabelProps={{ style: { fontFamily: 'inherit' } }}
                            inputProps={{
                                dir: 'rtl',
                                style: {
                                    fontFamily: 'inherit',
                                    textAlign: 'right',
                                },
                            }}
                        />

                        {signUpError && <Alert severity="error">{signUpError}</Alert>}

                        <Button variant="contained" color="primary" fullWidth type="submit">
                            הרשמה
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Box>
    );
};

export default SignUp;
