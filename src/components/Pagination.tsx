import { Box, Button, Typography } from "@mui/material";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
}

export function Pagination({ currentPage, totalPages, onPrevious, onNext }: PaginationProps) {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Button variant="outlined" onClick={onPrevious} disabled={currentPage === 1}>
        Previous
      </Button>
      <Typography>
        Page {currentPage} of {totalPages}
      </Typography>
      <Button variant="outlined" onClick={onNext} disabled={currentPage === totalPages}>
        Next
      </Button>
    </Box>
  );
}
