import { type ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  BottomNavigation,
  BottomNavigationAction,
  AppBar,
  Toolbar,
  Typography,
  Paper,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
import DevicesIcon from '@mui/icons-material/Devices';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { label: 'Recipientes', icon: <LocalDrinkIcon />, path: '/recipientes' },
  { label: 'Dispositivo', icon: <DevicesIcon />, path: '/dispositivos' },
  { label: 'Lembretes', icon: <NotificationsIcon />, path: '/lembretes' },
  { label: 'Perfil', icon: <PersonIcon />, path: '/perfil' },
];

interface LayoutProps {
  title: string;
  children: ReactNode;
}

export function Layout({ title, children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const currentIndex = NAV_ITEMS.findIndex((item) => location.pathname.startsWith(item.path));

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {isDesktop && (
        <Drawer
          variant="permanent"
          sx={{
            width: 220,
            '& .MuiDrawer-paper': { width: 220, boxSizing: 'border-box' },
          }}
        >
          <Toolbar>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
              SHI 💧
            </Typography>
          </Toolbar>
          <List>
            {NAV_ITEMS.map((item) => (
              <ListItemButton
                key={item.path}
                selected={location.pathname.startsWith(item.path)}
                onClick={() => navigate(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
        </Drawer>
      )}

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <AppBar position="static" elevation={1} color="default">
          <Toolbar>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>
          </Toolbar>
        </AppBar>

        <Box
          component="main"
          sx={{
            flex: 1,
            p: 2,
            pb: isDesktop ? 2 : 10,
            maxWidth: 800,
            width: '100%',
            mx: 'auto',
          }}
        >
          {children}
        </Box>
      </Box>

      {!isDesktop && (
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 }} elevation={3}>
          <BottomNavigation
            value={currentIndex}
            onChange={(_, newValue) => navigate(NAV_ITEMS[newValue].path)}
          >
            {NAV_ITEMS.map((item) => (
              <BottomNavigationAction key={item.path} label={item.label} icon={item.icon} />
            ))}
          </BottomNavigation>
        </Paper>
      )}
    </Box>
  );
}
