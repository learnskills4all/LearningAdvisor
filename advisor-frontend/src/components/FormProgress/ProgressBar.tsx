import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

export default function ProgressBar({
    progress,
    total,
}: {
    progress: number;
    total: number;
}) {
    return (
        <Box sx={{
            width: "75%",
            marginTop: "auto",
            marginBottom: "auto",
          }}>
          <LinearProgress variant="determinate" value={ progress / total * 100 } />
          <div> {total === 0 ? 0 : Math.round(progress / total * 100) }% </div>
        </Box>
    );
}