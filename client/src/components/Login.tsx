"use client"

import "../styles/global.css"
import axios from "axios"
import { useForm, type SubmitHandler } from "react-hook-form"
import type IFormInput from "../repositories/IFormInput"
import { useNavigate } from "react-router-dom"
import { useContext, useState } from "react"
import { detailsContext } from "../context/Provider"
import type { User } from "../repositories/User"
import {
    Box, Button, TextField, Typography, Stack, Alert, Paper,
    Link, Divider, Avatar
} from "@mui/material"
import { LockOutlined } from "@mui/icons-material"

const Login = ({ }: { isDarkMode: boolean }) => {
    const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>()
    const navigate = useNavigate()
    const detailsContextProvider = useContext(detailsContext)
    const [loginError, setLoginError] = useState("")

    const onSubmit: SubmitHandler<IFormInput> = async (user) => {
        try {
            setLoginError("")
            const { data } = await axios.post<User>("http://localhost:8080/api/user/login", user)
            detailsContextProvider.setMyId(data.Id)
            detailsContextProvider.setMyName(data.Name)
            detailsContextProvider.setMyEmail(data.Email)
            detailsContextProvider.setMyPassword(data.Password)
            navigate("/")
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 409) {
                    navigate("/home")
                } else if (error.response?.status === 401) {
                    navigate("/sign-up")
                } else {
                    setLoginError("שגיאה בהתחברות. נסה שוב.")
                }
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
                    maxWidth: 450,
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
                        <LockOutlined fontSize="large" />
                    </Avatar>
                    <Typography variant="h4" sx={{ fontFamily: "inherit", fontWeight: 600, color: "#fff" }}>
                        ברוכים הבאים
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontFamily: "inherit", color: "#ccc" }}>
                        התחברו לאתר המתכונים שלנו
                    </Typography>
                </Box>

                <Box sx={{ padding: 4, background: '#333333', color: "white" }}>
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        <Stack spacing={3}>
                            <TextField
                                label="שם משתמש"
                                fullWidth
                                variant="outlined"
                                {...register("UserName", {
                                    required: "שדה חובה",
                                    minLength: {
                                        value: 3,
                                        message: "לפחות 3 תווים",
                                    },
                                })}
                                error={!!errors.UserName}
                                helperText={errors.UserName?.message}
                                sx={textFieldStyles}
                            />

                            <TextField
                                label="סיסמה"
                                type="password"
                                fullWidth
                                variant="outlined"
                                {...register("Password", {
                                    required: "שדה חובה",
                                    minLength: {
                                        value: 6,
                                        message: "לפחות 6 תווים",
                                    },
                                })}
                                error={!!errors.Password}
                                helperText={errors.Password?.message}
                                sx={textFieldStyles}
                            />

                            {loginError && (
                                <Alert severity="error" sx={{ borderRadius: 2 }}>
                                    {loginError}
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
                                התחבר
                            </Button>

                            <Divider sx={{ my: 2 }}>
                                <Typography variant="body2" sx={{ color: "#aaa", fontFamily: "inherit" }}>
                                    או
                                </Typography>
                            </Divider>

                            <Box sx={{ textAlign: "center" }}>
                                <Typography variant="body1" sx={{ mb: 1, fontFamily: "inherit" }}>
                                    עדיין אין לך חשבון?
                                </Typography>
                                <Link
                                    href="/sign-up"
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
                                    הירשם עכשיו
                                </Link>
                            </Box>
                        </Stack>
                    </form>
                </Box>
            </Paper>
        </Box>
    )
}

export default Login
