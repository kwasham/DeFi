import PropTypes from 'prop-types';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { AppBar, Box, Button, Container, IconButton, Link, Toolbar } from '@mui/material';
import { Menu as MenuIcon } from '../icons/menu';
import { useAuth } from '../hooks/use-auth';
import { useMounted } from '../hooks/use-mounted';
import { Logo } from './logo';


export const MainNavbar = (props) => {
  const { onOpenSidebar } = props;
  const isMounted = useMounted();
  const router = useRouter();
  const { login } = useAuth();


  const clickHandler = async() => {

    try {
      await login();

      if (isMounted()) {
        const returnUrl = router.query.returnUrl || '/dashboard';
        router.push(returnUrl);
      }
    } catch (err) {
      console.error(err);

      if (isMounted()) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    }

  }


  return (
    <AppBar
      elevation={0}
      sx={{
        backgroundColor: 'background.paper',
        borderBottomColor: 'divider',
        borderBottomStyle: 'solid',
        borderBottomWidth: 1,
        color: 'text.secondary'
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{ minHeight: 64 }}
        >
          <NextLink
            href="/"
            passHref
          >
            <a>
              <Logo
                sx={{
                  display: {
                    md: 'inline',
                    xs: 'none'
                  },
                  height: 40,
                  width: 40
                }}
              />
            </a>
          </NextLink>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton
            color="inherit"
            onClick={onOpenSidebar}
            sx={{
              display: {
                md: 'none'
              }
            }}
          >
            <MenuIcon fontSize="small" />
          </IconButton>
          <Box
            sx={{
              alignItems: 'center',
              display: {
                md: 'flex',
                xs: 'none'
              }
            }}
          >
            <NextLink
              href="/dashboard"
              passHref
            >
              <Link
                color="textSecondary"
                underline="none"
                variant="subtitle2"
              >
                Live Demo
              </Link>
            </NextLink>
            <NextLink
              href="/browse"
              passHref
            >
              <Link
                color="textSecondary"
                sx={{ ml: 2 }}
                underline="none"
                variant="subtitle2"
              >
                Components
              </Link>
            </NextLink>
            <NextLink
              href="/docs/welcome"
              passHref
            >
              <Link
                color="textSecondary"
                component="a"
                sx={{ ml: 2 }}
                underline="none"
                variant="subtitle2"
              >
                Documentation
              </Link>
            </NextLink>
            <Button
              component="a"
              //href="https://material-ui.com/store/items/devias-kit-pro"
              size="medium"
              sx={{ ml: 2 }}
              target="_blank"
              variant="contained"
              onClick={clickHandler}
            >
              Buy Now
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

MainNavbar.propTypes = {
  onOpenSidebar: PropTypes.func
};
