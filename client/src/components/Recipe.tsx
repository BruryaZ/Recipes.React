import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { detailsContext } from "../context/Provider"

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme }) => ({
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
    ...(props => ({
        transform: props.expand ? 'rotate(180deg)' : 'rotate(0deg)',
    })),
}));

interface RecipeReviewCardProps {
    title: string;
    date: string;
    image: string;
    description: string;
    method: string[];
    difficulty: string;
    duration: number;
    userId: number;
    categoryId: number;
    ingredients: { Name: string }[];
    instructions: [{ Name: string }];
}

export default function RecipeReviewCard({
    title,
    date,
    image,
    description,
    method,
    difficulty,
    duration,
    userId,
    categoryId,
    ingredients,
    instructions
}: RecipeReviewCardProps) {
    const [expanded, setExpanded] = React.useState(false);
    const { name } = React.useContext(detailsContext)

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardHeader
                avatar={
                    <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                        {name[0].toUpperCase()} {/* ניתן להציג את האות הראשונה של הכותרת */}
                    </Avatar>
                }
                action={
                    <IconButton aria-label="settings">
                        <MoreVertIcon />
                    </IconButton>
                }
                title={title}
                subheader={date}
            />
            <CardMedia
                component="img"
                height="194"
                image={image}
                alt={title}
            />
            <CardContent>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {description}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Difficulty: {difficulty}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Duration: {duration} minutes
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    User ID: {userId}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Category ID: {categoryId}
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                <IconButton aria-label="add to favorites">
                    <FavoriteIcon />
                </IconButton>
                <IconButton aria-label="share">
                    <ShareIcon />
                </IconButton>
                <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                    <ExpandMoreIcon />
                </ExpandMore>

                {expanded && (
                    <div>
                        {instructions && instructions.map((ingredient, index) => (
                            <Typography key={index} sx={{ marginBottom: 1 }}>
                                {ingredient.Name}
                            </Typography>))}
                        {/* <p>I am Greate!</p> */}
                    </div>
                )}

            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <Typography variant="h6">Ingredients:</Typography>
                    {/* {ingredients.map((ingredient, index) => (
                        <Typography key={index} sx={{ marginBottom: 1 }}>
                            {ingredient.Name}
                        </Typography>
                    ))} */}
                    <Typography variant="h6">Method:</Typography>
                    {method.map((step, index) => (
                        <Typography key={index} sx={{ marginBottom: 2 }}>
                            {step}
                        </Typography>
                    ))}
                </CardContent>
            </Collapse>
        </Card>
    );
}
