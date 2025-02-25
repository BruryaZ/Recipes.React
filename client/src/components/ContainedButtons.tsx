import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

export default function ContainedButtons() {
  return (
    <Stack direction="row" spacing={5}>
      <Button variant="contained">עמוד הבית</Button>
      <Button variant="contained" >מתכונים</Button>
      <Button variant="contained" >הוספת מתכון</Button>
      <Button variant="contained" >עריכת מתכון</Button>
      <Button variant="contained" >צור קשר</Button>
      <Button variant="contained" >
        לאתרי המתכונים
      </Button>
    </Stack>
  );
}


 