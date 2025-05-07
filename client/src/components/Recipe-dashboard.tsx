import React from "react"

import { useState, useEffect, useContext } from "react"
import {
  Box,
  Grid,
  Paper,
  Typography,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  Button,
  IconButton,
  useTheme,
  Tab,
  Tabs,
  CircularProgress,
} from "@mui/material"
import {
  TrendingUp,
  Restaurant,
  AccessTime,
  Star,
  Favorite,
  BarChart,
  PieChart,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  ArrowUpward,
} from "@mui/icons-material"
import { detailsContext } from "../context/Provider"
import axios from "axios"
import type { Recipe, Category } from "../repositories/RecipeType"

// Mock data for charts
const popularCategories = [
  { name: "עוגות", count: 24, color: "#FF6384" },
  { name: "בשרים", count: 18, color: "#36A2EB" },
  { name: "סלטים", count: 15, color: "#FFCE56" },
  { name: "מאפים", count: 12, color: "#4BC0C0" },
  { name: "קינוחים", count: 10, color: "#9966FF" },
]

const activityData = [
  { day: "ראשון", recipes: 5 },
  { day: "שני", recipes: 8 },
  { day: "שלישי", recipes: 3 },
  { day: "רביעי", recipes: 7 },
  { day: "חמישי", recipes: 12 },
  { day: "שישי", recipes: 6 },
  { day: "שבת", recipes: 4 },
]

interface DashboardStats {
  totalRecipes: number
  myRecipes: number
  favoriteRecipes: number
  totalCategories: number
  popularRecipe: Recipe | null
  recentRecipes: Recipe[]
  isLoading: boolean
}

const RecipeDashboard = () => {
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === "dark"
  const { id, name } = useContext(detailsContext)
  const [tabValue, setTabValue] = useState(0)
  const [stats, setStats] = useState<DashboardStats>({
    totalRecipes: 0,
    myRecipes: 0,
    favoriteRecipes: 0,
    totalCategories: 0,
    popularRecipe: null,
    recentRecipes: [],
    isLoading: true,
  })

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch recipes
        const recipesRes = await axios.get<Recipe[]>("http://localhost:8080/api/recipe")
        const recipes = recipesRes.data

        // Fetch categories
        const categoriesRes = await axios.get<Category[]>("http://localhost:8080/api/category")
        const categories = categoriesRes.data

        // Calculate stats
        const myRecipes = recipes.filter((recipe) => recipe.UserId === id)

        // Sort by some criteria to determine "popular" recipe (using Duration as example)
        const sortedRecipes = [...recipes].sort((a, b) => b.Duration - a.Duration)
        const popularRecipe = sortedRecipes.length > 0 ? sortedRecipes[0] : null

        // Get most recent recipes
        const recentRecipes = [...recipes]
          .slice(0, 5)

        setStats({
          totalRecipes: recipes.length,
          myRecipes: myRecipes.length,
          favoriteRecipes: Math.floor(recipes.length * 0.2), // Mock data - 20% of recipes as favorites
          totalCategories: categories.length,
          popularRecipe,
          recentRecipes,
          isLoading: false,
        })
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        setStats((prev) => ({ ...prev, isLoading: false }))
      }
    }

    fetchDashboardData()
  }, [id])

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  if (stats.isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        backgroundColor: isDarkMode ? "#121212" : "#f8f9fa",
        minHeight: "100vh",
      }}
      dir="rtl"
    >
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            color: isDarkMode ? "#fff" : "#333",
            mb: 1,
          }}
        >
          דשבורד מתכונים
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: isDarkMode ? "#b0b0b0" : "#666",
          }}
        >
          ברוך הבא {name}! כאן תוכל לראות סטטיסטיקות ונתונים על המתכונים שלך.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              height: "100%",
              backgroundColor: isDarkMode ? "#1e1e1e" : "#fff",
              border: "1px solid",
              borderColor: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
              boxShadow: isDarkMode ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.05)",
              transition: "transform 0.2s",
              "&:hover": {
                transform: "translateY(-5px)",
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar
                sx={{
                  bgcolor: isDarkMode ? "rgba(144, 202, 249, 0.2)" : "rgba(25, 118, 210, 0.1)",
                  color: isDarkMode ? "#90caf9" : "#1976d2",
                  mr: 2,
                }}
              >
                <Restaurant />
              </Avatar>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                  color: isDarkMode ? "#b0b0b0" : "#666",
                }}
              >
                סה"כ מתכונים
              </Typography>
            </Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 600,
                color: isDarkMode ? "#fff" : "#333",
                mb: 1,
              }}
            >
              {stats.totalRecipes}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <ArrowUpward sx={{ color: "#4caf50", fontSize: 16, mr: 0.5 }} />
              <Typography
                variant="body2"
                sx={{
                  color: "#4caf50",
                }}
              >
                +12% מהחודש שעבר
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              height: "100%",
              backgroundColor: isDarkMode ? "#1e1e1e" : "#fff",
              border: "1px solid",
              borderColor: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
              boxShadow: isDarkMode ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.05)",
              transition: "transform 0.2s",
              "&:hover": {
                transform: "translateY(-5px)",
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar
                sx={{
                  bgcolor: isDarkMode ? "rgba(129, 199, 132, 0.2)" : "rgba(76, 175, 80, 0.1)",
                  color: isDarkMode ? "#81c784" : "#4caf50",
                  mr: 2,
                }}
              >
                <AddIcon />
              </Avatar>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                  color: isDarkMode ? "#b0b0b0" : "#666",
                }}
              >
                המתכונים שלי
              </Typography>
            </Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 600,
                color: isDarkMode ? "#fff" : "#333",
                mb: 1,
              }}
            >
              {stats.myRecipes}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <ArrowUpward sx={{ color: "#4caf50", fontSize: 16, mr: 0.5 }} />
              <Typography
                variant="body2"
                sx={{
                  color: "#4caf50",
                }}
              >
                +3 מתכונים חדשים
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              height: "100%",
              backgroundColor: isDarkMode ? "#1e1e1e" : "#fff",
              border: "1px solid",
              borderColor: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
              boxShadow: isDarkMode ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.05)",
              transition: "transform 0.2s",
              "&:hover": {
                transform: "translateY(-5px)",
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar
                sx={{
                  bgcolor: isDarkMode ? "rgba(255, 138, 128, 0.2)" : "rgba(244, 67, 54, 0.1)",
                  color: isDarkMode ? "#ff8a80" : "#f44336",
                  mr: 2,
                }}
              >
                <Favorite />
              </Avatar>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                  color: isDarkMode ? "#b0b0b0" : "#666",
                }}
              >
                מתכונים מועדפים
              </Typography>
            </Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 600,
                color: isDarkMode ? "#fff" : "#333",
                mb: 1,
              }}
            >
              {stats.favoriteRecipes}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <ArrowUpward sx={{ color: "#4caf50", fontSize: 16, mr: 0.5 }} />
              <Typography
                variant="body2"
                sx={{
                  color: "#4caf50",
                }}
              >
                +5 מתכונים חדשים
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              height: "100%",
              backgroundColor: isDarkMode ? "#1e1e1e" : "#fff",
              border: "1px solid",
              borderColor: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
              boxShadow: isDarkMode ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.05)",
              transition: "transform 0.2s",
              "&:hover": {
                transform: "translateY(-5px)",
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar
                sx={{
                  bgcolor: isDarkMode ? "rgba(255, 213, 79, 0.2)" : "rgba(255, 193, 7, 0.1)",
                  color: isDarkMode ? "#ffd54f" : "#ffc107",
                  mr: 2,
                }}
              >
                <PieChart />
              </Avatar>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                  color: isDarkMode ? "#b0b0b0" : "#666",
                }}
              >
                קטגוריות
              </Typography>
            </Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 600,
                color: isDarkMode ? "#fff" : "#333",
                mb: 1,
              }}
            >
              {stats.totalCategories}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <ArrowUpward sx={{ color: "#4caf50", fontSize: 16, mr: 0.5 }} />
              <Typography
                variant="body2"
                sx={{
                  color: "#4caf50",
                }}
              >
                +2 קטגוריות חדשות
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid item xs={12} md={8}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 4,
              overflow: "hidden",
              backgroundColor: isDarkMode ? "#1e1e1e" : "#fff",
              border: "1px solid",
              borderColor: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
              boxShadow: isDarkMode ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.05)",
              mb: 3,
            }}
          >
            <Box
              sx={{
                p: 2,
                backgroundColor: isDarkMode ? "#272727" : "#f0f7ff",
                borderBottom: "1px solid",
                borderColor: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: isDarkMode ? "#fff" : "#1976d2",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <BarChart sx={{ mr: 1 }} /> סטטיסטיקות מתכונים
              </Typography>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                textColor="primary"
                indicatorColor="primary"
                sx={{
                  "& .MuiTab-root": {
                    minWidth: 100,
                    fontWeight: 500,
                  },
                }}
              >
                <Tab label="שבועי" />
                <Tab label="חודשי" />
                <Tab label="שנתי" />
              </Tabs>
            </Box>
            <Box sx={{ p: 3 }}>
              {/* Chart Placeholder */}
              <Box
                sx={{
                  height: 300,
                  backgroundColor: isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(25,118,210,0.05)",
                  borderRadius: 2,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  p: 2,
                }}
              >
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
                  פעילות מתכונים לפי ימים
                </Typography>
                <Box sx={{ display: "flex", height: "80%", alignItems: "flex-end", justifyContent: "space-between" }}>
                  {activityData.map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        width: `${100 / activityData.length}%`,
                      }}
                    >
                      <Box
                        sx={{
                          width: "60%",
                          height: `${(item.recipes / 12) * 100}%`,
                          minHeight: 20,
                          backgroundColor: isDarkMode ? "#90caf9" : "#1976d2",
                          borderRadius: "4px 4px 0 0",
                          transition: "height 0.3s",
                          "&:hover": {
                            backgroundColor: isDarkMode ? "#64b5f6" : "#1565c0",
                          },
                        }}
                      />
                      <Typography variant="caption" sx={{ mt: 1 }}>
                        {item.day}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              borderRadius: 4,
              overflow: "hidden",
              backgroundColor: isDarkMode ? "#1e1e1e" : "#fff",
              border: "1px solid",
              borderColor: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
              boxShadow: isDarkMode ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.05)",
            }}
          >
            <Box
              sx={{
                p: 2,
                backgroundColor: isDarkMode ? "#272727" : "#f0f7ff",
                borderBottom: "1px solid",
                borderColor: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: isDarkMode ? "#fff" : "#1976d2",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Restaurant sx={{ mr: 1 }} /> מתכונים אחרונים
              </Typography>
              <Button
                variant="text"
                size="small"
                sx={{
                  fontWeight: 500,
                }}
              >
                הצג הכל
              </Button>
            </Box>
            <List sx={{ p: 0 }}>
              {stats.recentRecipes.map((recipe, index) => (
                <React.Fragment key={recipe.Id}>
                  <ListItem
                    sx={{
                      py: 2,
                      px: 3,
                      "&:hover": {
                        backgroundColor: isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(25,118,210,0.05)",
                      },
                    }}
                    secondaryAction={
                      <IconButton edge="end">
                        <MoreVertIcon />
                      </IconButton>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar
                        variant="rounded"
                        src={recipe.Img}
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: 2,
                          mr: 1,
                        }}
                      >
                        <Restaurant />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                          {recipe.Name}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                          <Chip
                            size="small"
                            label={`${recipe.Duration} דקות`}
                            icon={<AccessTime sx={{ fontSize: "0.8rem !important" }} />}
                            sx={{
                              mr: 1,
                              height: 24,
                              fontSize: "0.75rem",
                              backgroundColor: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
                            }}
                          />
                          <Chip
                            size="small"
                            label={`רמה ${recipe.Difficulty}`}
                            icon={<Star sx={{ fontSize: "0.8rem !important" }} />}
                            sx={{
                              height: 24,
                              fontSize: "0.75rem",
                              backgroundColor: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
                            }}
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < stats.recentRecipes.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={4}>
          {/* Popular Recipe */}
          {stats.popularRecipe && (
            <Paper
              elevation={0}
              sx={{
                borderRadius: 4,
                overflow: "hidden",
                backgroundColor: isDarkMode ? "#1e1e1e" : "#fff",
                border: "1px solid",
                borderColor: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
                boxShadow: isDarkMode ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.05)",
                mb: 3,
              }}
            >
              <Box
                sx={{
                  p: 2,
                  backgroundColor: isDarkMode ? "#272727" : "#f0f7ff",
                  borderBottom: "1px solid",
                  borderColor: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: isDarkMode ? "#fff" : "#1976d2",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <TrendingUp sx={{ mr: 1 }} /> המתכון הפופולרי ביותר
                </Typography>
              </Box>
              <Box
                sx={{
                  position: "relative",
                  height: 160,
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url(${stats.popularRecipe.Img})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    p: 2,
                    color: "#fff",
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {stats.popularRecipe.Name}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <Chip
                      size="small"
                      label={`${stats.popularRecipe.Duration} דקות`}
                      icon={<AccessTime sx={{ fontSize: "0.8rem !important", color: "#fff" }} />}
                      sx={{
                        mr: 1,
                        height: 24,
                        fontSize: "0.75rem",
                        backgroundColor: "rgba(255,255,255,0.2)",
                        color: "#fff",
                      }}
                    />
                    <Chip
                      size="small"
                      label={`רמה ${stats.popularRecipe.Difficulty}`}
                      icon={<Star sx={{ fontSize: "0.8rem !important", color: "#fff" }} />}
                      sx={{
                        height: 24,
                        fontSize: "0.75rem",
                        backgroundColor: "rgba(255,255,255,0.2)",
                        color: "#fff",
                      }}
                    />
                  </Box>
                </Box>
              </Box>
              <Box sx={{ p: 2 }}>
                <Typography variant="body2" sx={{ mb: 2, color: isDarkMode ? "#b0b0b0" : "#666" }}>
                  {stats.popularRecipe.Description.length > 120
                    ? `${stats.popularRecipe.Description.substring(0, 120)}...`
                    : stats.popularRecipe.Description}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    borderRadius: 8,
                  }}
                >
                  צפה במתכון
                </Button>
              </Box>
            </Paper>
          )}

          {/* Popular Categories */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: 4,
              overflow: "hidden",
              backgroundColor: isDarkMode ? "#1e1e1e" : "#fff",
              border: "1px solid",
              borderColor: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
              boxShadow: isDarkMode ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.05)",
            }}
          >
            <Box
              sx={{
                p: 2,
                backgroundColor: isDarkMode ? "#272727" : "#f0f7ff",
                borderBottom: "1px solid",
                borderColor: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: isDarkMode ? "#fff" : "#1976d2",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <PieChart sx={{ mr: 1 }} /> קטגוריות פופולריות
              </Typography>
            </Box>
            <Box sx={{ p: 3 }}>
              {popularCategories.map((category, index) => (
                <Box key={index} sx={{ mb: index < popularCategories.length - 1 ? 3 : 0 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {category.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: isDarkMode ? "#b0b0b0" : "#666" }}>
                      {category.count} מתכונים
                    </Typography>
                  </Box>
                  <Box sx={{ position: "relative", height: 8, borderRadius: 4, backgroundColor: "rgba(0,0,0,0.08)" }}>
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        height: "100%",
                        width: `${(category.count / 24) * 100}%`,
                        borderRadius: 4,
                        backgroundColor: category.color,
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default RecipeDashboard
