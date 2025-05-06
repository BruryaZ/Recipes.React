"use client"

import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Stack,
  Divider,
  Box,
  useMediaQuery,
  useTheme,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
} from "@mui/material"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import WhatshotIcon from "@mui/icons-material/Whatshot"
import RestaurantIcon from "@mui/icons-material/Restaurant"
import MenuBookIcon from "@mui/icons-material/MenuBook"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import CircleIcon from "@mui/icons-material/Circle"
import { useNavigate } from "react-router-dom"
import { useContext, useEffect, useState } from "react"
import { detailsContext } from "../context/Provider"
import axios from "axios"

const difficultyMap: Record<number, string> = {
  1: "קל",
  2: "בינוני",
  3: "קשה",
}

const difficultyColors: Record<string, string> = {
  קל: "#388e3c",
  בינוני: "#f9a825",
  קשה: "#d32f2f",
}

const Recipe = ({ Id, title, date, image, description, method, difficulty, duration, ingredients, userId }: any) => {
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"))
  const navigate = useNavigate()
  const detailsContextProvider = useContext(detailsContext)
  const [unauthorized, setUnauthorized] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const isDarkMode = theme.palette.mode === "dark"

  useEffect(() => {
    // בדיקה אם המשתמש הנוכחי הוא בעל המתכון
    if (userId !== detailsContextProvider.id) {
      setUnauthorized(true) // אם לא, הצג הודעה שלא מורשה
    }
  }, [Id, detailsContextProvider.id])

  const handleEditClick = () => {
    navigate(`/edit/${Id}`)
  }

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true) // הצגת דיאלוג אישור מחיקה
  }

  const handleConfirmDelete = async () => {
    setOpenDeleteDialog(false)
    try {
      const res = await axios.post<any>(`http://localhost:8080/api/recipe/delete/${Id}`)
      console.log(res)
      // Redirect or refresh after successful deletion
      navigate("/recipes")
    } catch (error) {
      console.log("שגיאה במחיקת המתכון:", error)
    }
  }

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false)
  }

  // המרת רמת הקושי למילים אם מדובר במספר
  const difficultyText = typeof difficulty === "number" ? difficultyMap[difficulty] || "לא מוגדר" : difficulty

  return (
    <Card
      sx={{
        maxWidth: "1000px",
        margin: "30px auto",
        borderRadius: 3,
        boxShadow: 6,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        backgroundColor: isDarkMode ? "#2d2d2d" : "#fff",
      }}
      dir="rtl"
    >
      <CardMedia component="img" height="400" image={image} alt={title} sx={{ objectFit: "cover" }} />
      <CardContent sx={{ padding: 4 }}>
        <Typography
          gutterBottom
          variant="h4"
          component="div"
          sx={{
            fontWeight: "bold",
            textAlign: "right",
            color: isDarkMode ? "#fff" : "#333",
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            mb: 3,
            textAlign: "right",
            color: isDarkMode ? "#ccc" : "#666",
            fontSize: "1.1rem",
            lineHeight: 1.6,
          }}
        >
          {description}
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "flex-start", sm: "center" }}
          sx={{ mb: 3 }}
        >
          <Chip
            icon={<WhatshotIcon />}
            label={difficultyText}
            sx={{
              backgroundColor: difficultyColors[difficultyText] || "#757575",
              color: "#fff",
              fontWeight: 600,
              fontSize: "1rem",
              px: 2,
              py: 1,
              borderRadius: 8,
            }}
          />
          <Chip
            icon={<AccessTimeIcon />}
            label={`${duration} דקות`}
            sx={{
              fontSize: "1rem",
              fontWeight: 600,
              px: 2,
              py: 1,
              borderRadius: 8,
              backgroundColor: isDarkMode ? "#333" : "#f0f7ff",
              color: isDarkMode ? "#fff" : "#1976d2",
            }}
          />
          <Box sx={{ flexGrow: 1 }} />
          <Typography
            variant="subtitle2"
            sx={{
              mt: isSmallScreen ? 1 : 0,
              textAlign: "left",
              color: isDarkMode ? "#aaa" : "#777",
            }}
          >
            {date}
          </Typography>
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4 }}>
          <Paper
            elevation={0}
            sx={{
              flex: 1,
              p: 3,
              borderRadius: 2,
              backgroundColor: isDarkMode ? "#333" : "#f9f9f9",
              border: "1px solid",
              borderColor: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar sx={{ bgcolor: isDarkMode ? "#90caf9" : "#1976d2", mr: 1 }}>
                <RestaurantIcon />
              </Avatar>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: isDarkMode ? "#90caf9" : "#1976d2",
                }}
              >
                מצרכים
              </Typography>
            </Box>

            <List sx={{ pt: 0 }}>
              {ingredients?.map((ingredient: any, idx: number) => (
                <ListItem key={idx} sx={{ px: 0, py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 30 }}>
                    <CircleIcon sx={{ fontSize: 8, color: isDarkMode ? "#90caf9" : "#1976d2" }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${ingredient.Name} – ${ingredient.Count} ${ingredient.Type}`}
                    primaryTypographyProps={{
                      sx: {
                        textAlign: "right",
                        color: isDarkMode ? "#fff" : "#333",
                      },
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              flex: 1.5,
              p: 3,
              borderRadius: 2,
              backgroundColor: isDarkMode ? "#333" : "#f9f9f9",
              border: "1px solid",
              borderColor: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar sx={{ bgcolor: isDarkMode ? "#90caf9" : "#1976d2", mr: 1 }}>
                <MenuBookIcon />
              </Avatar>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: isDarkMode ? "#90caf9" : "#1976d2",
                }}
              >
                הוראות הכנה
              </Typography>
            </Box>

            <List sx={{ pt: 0 }}>
              {method?.map((step: string, idx: number) => (
                <ListItem key={idx} sx={{ px: 0, py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Avatar
                      sx={{
                        width: 24,
                        height: 24,
                        fontSize: "0.8rem",
                        bgcolor: isDarkMode ? "#90caf9" : "#1976d2",
                      }}
                    >
                      {idx + 1}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={step}
                    primaryTypographyProps={{
                      sx: {
                        textAlign: "right",
                        color: isDarkMode ? "#fff" : "#333",
                      },
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* הצגת הודעה אם המשתמש לא יכול לערוך את המתכון */}
        {unauthorized ? (
          <Typography
            variant="body1"
            color="error"
            align="center"
            sx={{
              fontFamily: "inherit",
              marginTop: 2,
              p: 2,
              borderRadius: 2,
              backgroundColor: isDarkMode ? "rgba(244, 67, 54, 0.1)" : "rgba(244, 67, 54, 0.05)",
            }}
          >
            אין לך הרשאה לערוך את המתכון הזה.
          </Typography>
        ) : (
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleEditClick}
              sx={{
                flex: 1,
                py: 1.5,
                borderRadius: 2,
                backgroundColor: isDarkMode ? "#90caf9" : "#1976d2",
                "&:hover": {
                  backgroundColor: isDarkMode ? "#64b5f6" : "#1565c0",
                },
              }}
              startIcon={<EditIcon />}
            >
              ערוך מתכון
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={handleDeleteClick}
              sx={{
                flex: 1,
                py: 1.5,
                borderRadius: 2,
              }}
              startIcon={<DeleteIcon />}
            >
              מחק מתכון
            </Button>
          </Stack>
        )}
      </CardContent>

      {/* דיאלוג אישור מחיקה */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCancelDelete}
        dir="rtl"
        PaperProps={{
          sx: {
            borderRadius: 3,
            backgroundColor: isDarkMode ? "#333" : "#fff",
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: isDarkMode ? "#424242" : "#f0f7ff",
            color: isDarkMode ? "#fff" : "#1976d2",
            fontWeight: 600,
          }}
        >
          אישור מחיקת מתכון
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Typography variant="body1" sx={{ textAlign: "right" }}>
            האם אתה בטוח שברצונך למחוק את המתכון הזה? פעולה זו לא ניתנת לביטול.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCancelDelete} color="primary" variant="outlined" sx={{ borderRadius: 2 }}>
            ביטול
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained" sx={{ borderRadius: 2 }}>
            מחק
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

export default Recipe
