import { Block, CheckCircle } from '@mui/icons-material';
import {
    Box,
    Button,
    Chip,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import { useEffect } from 'react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { fetchUsers, updateUserStatus } from '../store/slices/usersSlice';

export default function Users() {
  const dispatch = useAppDispatch();
  const { list: users, isLoading } = useAppSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleStatusChange = async (userId: string, newStatus: 'active' | 'suspended' | 'banned') => {
    await dispatch(updateUserStatus({ id: userId, status: newStatus }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'suspended':
        return 'warning';
      case 'banned':
        return 'error';
      default:
        return 'default';
    }
  };

  if (isLoading) {
    return (
      <Box>
        <Typography>Loading users...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Mobile</TableCell>
              <TableCell>Trip Count</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.mobile}</TableCell>
                <TableCell>{user.tripCount}</TableCell>
                <TableCell>
                  <Chip
                    label={user.status}
                    color={getStatusColor(user.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {user.status === 'active' ? (
                    <Button
                      startIcon={<Block />}
                      color="warning"
                      size="small"
                      onClick={() => handleStatusChange(user.id, 'suspended')}
                    >
                      Suspend
                    </Button>
                  ) : user.status === 'suspended' ? (
                    <>
                      <Button
                        startIcon={<CheckCircle />}
                        color="success"
                        size="small"
                        onClick={() => handleStatusChange(user.id, 'active')}
                        sx={{ mr: 1 }}
                      >
                        Activate
                      </Button>
                      <Button
                        startIcon={<Block />}
                        color="error"
                        size="small"
                        onClick={() => handleStatusChange(user.id, 'banned')}
                      >
                        Ban
                      </Button>
                    </>
                  ) : null}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}