import "../styles/global.css"
import { Box, Typography, Paper, TextField, Button, Grid, useTheme } from "@mui/material"
import {
  Send as SendIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material"

const Contact = () => {
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === "dark"

  return (
    <Box
      sx={{
        py: 4,
        px: 2,
        backgroundColor: isDarkMode ? "#121212" : "#f5f5f5",
      }}
      dir="rtl"
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
          maxWidth: 1000,
          mx: "auto",
          backgroundColor: isDarkMode ? "#1e1e1e" : "#ffffff",
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 600,
            textAlign: "center",
            mb: 4,
            color: isDarkMode ? "#ffffff" : "#333333",
          }}
        >
          צור קשר
        </Typography>

        <Typography
          variant="h6"
          sx={{
            mb: 4,
            textAlign: "center",
            color: isDarkMode ? "#aaaaaa" : "#666666",
          }}
        >
          שלחו לנו הודעה ונחזור אליכם בהקדם!
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <TextField
                label="שם מלא"
                fullWidth
                variant="outlined"
                InputLabelProps={{ style: { fontFamily: "inherit" } }}
                inputProps={{
                  dir: "rtl",
                  style: {
                    fontFamily: "inherit",
                    textAlign: "right",
                  },
                }}
              />

              <TextField
                label="אימייל"
                fullWidth
                variant="outlined"
                type="email"
                InputLabelProps={{ style: { fontFamily: "inherit" } }}
                inputProps={{
                  dir: "rtl",
                  style: {
                    fontFamily: "inherit",
                    textAlign: "right",
                  },
                }}
              />

              <TextField
                label="נושא"
                fullWidth
                variant="outlined"
                InputLabelProps={{ style: { fontFamily: "inherit" } }}
                inputProps={{
                  dir: "rtl",
                  style: {
                    fontFamily: "inherit",
                    textAlign: "right",
                  },
                }}
              />

              <TextField
                label="הודעה"
                fullWidth
                variant="outlined"
                multiline
                rows={5}
                InputLabelProps={{ style: { fontFamily: "inherit" } }}
                inputProps={{
                  dir: "rtl",
                  style: {
                    fontFamily: "inherit",
                    textAlign: "right",
                  },
                }}
              />

              <Button
                variant="contained"
                size="large"
                endIcon={<SendIcon />}
                sx={{
                  mt: 2,
                  alignSelf: "flex-start",
                  borderRadius: 2,
                  py: 1.5,
                  px: 4,
                  fontWeight: 500,
                  boxShadow: "none",
                  "&:hover": {
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  },
                }}
              >
                שלח הודעה
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 4,
                p: 3,
                backgroundColor: isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(25,118,210,0.05)",
                borderRadius: 3,
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  mb: 3,
                  fontWeight: 600,
                  color: isDarkMode ? "#ffffff" : "#333333",
                }}
              >
                פרטי התקשרות
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <PhoneIcon color="primary" />
                <Typography>03-1234567</Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <EmailIcon color="primary" />
                <Typography>info@recipes.co.il</Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <LocationIcon color="primary" />
                <Typography>רחוב המתכונים 123, תל אביב</Typography>
              </Box>

              <Box
                sx={{
                  mt: 4,
                  height: 200,
                  backgroundColor: isDarkMode ? "#333333" : "#e0e0e0",
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography color="text.secondary">מפה תוצג כאן</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  )
}

export default Contact
