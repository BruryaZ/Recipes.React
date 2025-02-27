import '../styles/global.css'
import milky from "../img/milky.jpg";
import fleshy from "../img/fleshy.jpg";
import petit_fours from "../img/petit_fours3.jpg";
import children from "../img/child_food.jpg";
import cake from '../img/cakes.jpg'
import personal_cups from '../img/personal_cups.png'
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import StarBorderIcon from '@mui/icons-material/StarBorder';

function srcset(image: string, width: number, height: number, rows = 1, cols = 1) {
  return {
    src: `${image}?w=${width * cols}&h=${height * rows}&fit=crop&auto=format`,
    srcSet: `${image}?w=${width * cols}&h=${height * rows
      }&fit=crop&auto=format&dpr=2 2x`,
  };
}



export default function ImagesDashboard() {
  return (
    <ImageList
      sx={{
        width: '100%', // שינוי לרוחב 100%
        height: 'auto', // גובה אוטומטי
        transform: 'translateZ(0)',
        objectFit: 'center',

      }}
      rowHeight={200}
      gap={1}
    >
      {itemData.map((item) => {
        const cols = item.featured ? 3 : 1;
        const rows = item.featured ? 3 : 1;

        return (
          <ImageListItem key={item.img} cols={cols} rows={rows}>
            <img
              {...srcset(item.img, 250, 200, rows, cols)}
              alt={item.title}
              loading="lazy"
            />
            <ImageListItemBar
              sx={{
                background:
                  'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                  'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
              }}
              title={item.title}
              position="top"
              actionIcon={
                <IconButton
                  sx={{ color: 'white' }}
                  aria-label={`star ${item.title}`}
                >
                  <StarBorderIcon />
                </IconButton>
              }
              actionPosition="left"
            />
          </ImageListItem>
        );
      })}
    </ImageList>
  );
}


const itemData = [
  {
    img: personal_cups,
    title: 'כוסות קינוח אישיות',
    featured: true,
  },
  {
    img: fleshy,
    title: 'בשרים',
    author: '@rollelflex_graphy726',
  },
  {
    img: petit_fours,
    title: 'פטיפורים',
    author: '@helloimnik',
  },
  {
    img: children,
    title: 'אוכל שילדים אוהבים',
    author: '@nolanissac',
  },
  {
    img: cake,
    title: 'עוגות',
    author: '@hjrc33',
  },
  {
    img: milky,
    title: 'בר חלבי',
    featured: true,
  },
];