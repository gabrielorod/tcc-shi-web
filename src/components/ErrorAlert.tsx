import { Alert, Box } from '@mui/material';

interface ErrorAlertProps {
  message: string;
}

export function ErrorAlert({ message }: ErrorAlertProps) {
  return (
    <Box sx={{ py: 2 }}>
      <Alert severity="error">{message}</Alert>
    </Box>
  );
}
