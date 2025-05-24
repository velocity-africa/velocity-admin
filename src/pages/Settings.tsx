import {
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    Grid,
    TextField,
    Typography,
} from '@mui/material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

export default function Settings() {
  const admin = useSelector((state: RootState) => state.auth.admin);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement profile update logic
    console.log('Updating profile...');
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      // Show error
      return;
    }
    // Implement password change logic
    console.log('Changing password...');
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Profile Settings
              </Typography>
              <Box component="form" onSubmit={handleProfileUpdate}>
                <TextField
                  fullWidth
                  label="Name"
                  margin="normal"
                  defaultValue={admin?.name}
                />
                <TextField
                  fullWidth
                  label="Email"
                  margin="normal"
                  defaultValue={admin?.email}
                  disabled
                />
                <TextField
                  fullWidth
                  label="Role"
                  margin="normal"
                  defaultValue={admin?.role}
                  disabled
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                >
                  Update Profile
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Change Password
              </Typography>
              <Box component="form" onSubmit={handlePasswordChange}>
                <TextField
                  fullWidth
                  label="Current Password"
                  type="password"
                  margin="normal"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <TextField
                  fullWidth
                  label="New Password"
                  type="password"
                  margin="normal"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  type="password"
                  margin="normal"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={newPassword !== confirmPassword && confirmPassword !== ''}
                  helperText={
                    newPassword !== confirmPassword && confirmPassword !== ''
                      ? 'Passwords do not match'
                      : ''
                  }
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                >
                  Change Password
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                System Settings
              </Typography>
              <Divider sx={{ my: 2 }} />
              {/* Add system settings here */}
              <Typography color="text.secondary">
                System settings will be implemented in the next phase.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}