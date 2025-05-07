import "../styles/global.css"
import axios from "axios"
import { type SubmitHandler, useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { useContext, useState } from "react"
import { detailsContext } from "../context/Provider"
import {
    Box, Button, TextField, Typography, Stack, Alert, Paper,
    Avatar, Link, Divider, Grid
} from "@mui/material"
import { PersonAddOutlined } from "@mui/icons-material"
import type { UserSignUp, UserSignUpRes } from "../repositories/IFormInputSignUp"

const SignUp = ({ }: { isDarkMode: boolean }) => {
    const navigate = useNavigate()
    const { register, handleSubmit, formState: { errors } } = useForm<UserSignUp>()
    const detailsContextProvider = useContext(detailsContext)
    const [signUpError, setSignUpError] = useState("")

    const onSubmit: SubmitHandler<UserSignUp> = async (user) => {
        setSignUpError("")
        try {
            const { data } = await axios.post<UserSignUpRes>("http://localhost:8080/api/user/sighin", user)
            detailsContextProvider.setMyId(data.Id)
            detailsContextProvider.setMyName(data.Name)
            detailsContextProvider.setMyEmail(data.Email)
            detailsContextProvider.setMyPassword(data.Password)
            navigate("/")
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setSignUpError("שגיאה בהרשמה. נסו שוב.")
            } else {
                setSignUpError("אירעה שגיאה כללית.")
            }
        }
    }

    const textFieldStyles = {
        '& label': {
            color: 'white',
            fontFamily: 'inherit',
        },
        '& label.Mui-focused': {
            color: '#90caf9',
        },
        '& .MuiInputBase-input': {
            color: 'white',
            textAlign: 'right',
            fontFamily: 'inherit',
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: 'white',
            },
            '&:hover fieldset': {
                borderColor: '#90caf9',
            },
            '&.Mui-focused fieldset': {
                borderColor: '#90caf9',
            },
        },
    }

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                backgroundColor: "#1e1e1e",
                color: "white",
                padding: 4,
                fontFamily: "inherit"
            }}
            dir="rtl"
        >
            <Paper
                elevation={6}
                sx={{
                    width: "100%",
                    maxWidth: 600,
                    padding: 0,
                    borderRadius: 3,
                    overflow: "hidden",
                }}
            >
                <Box
                    sx={{
                        padding: 4,
                        background: 'linear-gradient(135deg,#1e1e1e,#90caf9)',
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        borderBottom: "1px solid",
                    }}
                >
                    <Avatar sx={{
                        m: 1,
                        bgcolor: "#90caf9",
                        width: 56,
                        height: 56,
                    }}>
                        <PersonAddOutlined fontSize="large" />
                    </Avatar>
                    <Typography variant="h4" sx={{ fontFamily: "inherit", fontWeight: 600, color: "#fff" }}>
                        הרשמה לאתר
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontFamily: "inherit", color: "#ccc" }}>
                        הצטרפו אלינו ותוכלו להוסיף מתכונים משלכם
                    </Typography>
                </Box>

                <Box sx={{ padding: 4, background: '#333333', color: "white" }}>
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        <Stack spacing={3}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="שם משתמש"
                                        fullWidth
                                        variant="outlined"
                                        {...register("UserName", {
                                            required: "שדה חובה",
                                            minLength: { value: 3, message: "לפחות 3 תווים" },
                                        })}
                                        error={!!errors.UserName}
                                        helperText={errors.UserName?.message}
                                        sx={textFieldStyles}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="סיסמה"
                                        type="password"
                                        fullWidth
                                        variant="outlined"
                                        {...register("Password", {
                                            required: "שדה חובה",
                                            minLength: { value: 6, message: "לפחות 6 תווים" },
                                        })}
                                        error={!!errors.Password}
                                        helperText={errors.Password?.message}
                                        sx={textFieldStyles}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="שם מלא"
                                        fullWidth
                                        variant="outlined"
                                        {...register("Name", { required: "שדה חובה" })}
                                        error={!!errors.Name}
                                        helperText={errors.Name?.message}
                                        sx={textFieldStyles}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="טלפון"
                                        fullWidth
                                        variant="outlined"
                                        {...register("Phone", {
                                            required: "שדה חובה",
                                            pattern: {
                                                value: /^[0-9]{9,10}$/,
                                                message: "מספר טלפון לא תקין",
                                            },
                                        })}
                                        error={!!errors.Phone}
                                        helperText={errors.Phone?.message}
                                        sx={textFieldStyles}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="תעודת זהות"
                                        fullWidth
                                        variant="outlined"
                                        {...register("Tz", {
                                            required: "שדה חובה",
                                            pattern: {
                                                value: /^[0-9]{9}$/,
                                                message: "מספר זהות לא תקין",
                                            },
                                        })}
                                        error={!!errors.Tz}
                                        helperText={errors.Tz?.message}
                                        sx={textFieldStyles}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="מייל"
                                        fullWidth
                                        type="email"
                                        variant="outlined"
                                        {...register("Email", {
                                            required: "שדה חובה",
                                            pattern: {
                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message: "כתובת מייל לא תקינה",
                                            },
                                        })}
                                        error={!!errors.Email}
                                        helperText={errors.Email?.message}
                                        sx={textFieldStyles}
                                    />
                                </Grid>
                            </Grid>

                            {signUpError && (
                                <Alert severity="error" sx={{ borderRadius: 2 }}>
                                    {signUpError}
                                </Alert>
                            )}

                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                type="submit"
                                size="large"
                                sx={{
                                    mt: 2,
                                    py: 1.5,
                                    borderRadius: 2,
                                    fontSize: "1.1rem",
                                    fontWeight: 600,
                                    background: 'linear-gradient(135deg ,#90caf9,#1e1e1e)',
                                    color: "white",
                                    "&:hover": {
                                        backgroundColor: "#1565c0",
                                    },
                                    fontFamily: "inherit" 
                                }}
                            >
                                הרשמה
                            </Button>

                            <Divider sx={{ my: 2, color: "black" }}>
                                <Typography variant="body2" sx={{ color: "#90caf9", fontFamily: "inherit"  }}>
                                    או
                                </Typography>
                            </Divider>

                            <Box sx={{ textAlign: "center" }}>
                                <Typography variant="body1" sx={{ mb: 1,fontFamily: "inherit"  }}>
                                    כבר יש לך חשבון?
                                </Typography>
                                <Link
                                    href="/login"
                                    variant="body1"
                                    sx={{
                                        color: "#90caf9",
                                        textDecoration: "none",
                                        fontWeight: 600,
                                        "&:hover": {
                                            textDecoration: "underline",
                                        },
                                        fontFamily: "inherit" 
                                    }}
                                >
                                    התחבר עכשיו
                                </Link>
                            </Box>
                        </Stack>
                    </form>
                </Box>
            </Paper>
        </Box>
    )
}

export default SignUp
