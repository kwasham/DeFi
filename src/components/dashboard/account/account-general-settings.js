import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useAuth } from '../../../hooks/use-auth'
import {useMoralis} from 'react-moralis'
import { UserCircle as UserCircleIcon } from "../../../icons/user-circle";
import toast, {Toaster} from 'react-hot-toast'
import { ConstructionOutlined } from "@mui/icons-material";

const Input = styled("input")({
  display: "none",
});

export const AccountGeneralSettings = (props) => {
  const {Moralis} = useMoralis()
  const { user, profile } = useAuth()
  
  const [profilePic, setProfilePic] = useState(profile.attributes.avatar._url)
  const [name, setName] = useState(profile.attributes.name)
  console.log('here is your profile', profile)

  
  const changeName = () => {
    
    profile.set('name', name)
    profile.save()
    toast.success('User Name Saved')
  }

  const uploadProfilePic = async (pic) => {
    
    const file = new Moralis.File(pic.name, pic)
    
    profile.set('avatar', file)
    
    // myProfile = await myProfile.save()
    // user.set('profile', myProfile)
    const myPromise = profile.save()
    
    toast.promise(myPromise, {
      loading: 'Updating..',
      success: () => {
        setProfilePic(profile.attributes.avatar._url)
        return 'Saved Profile Pic'
      },
      error: 'Error when saving'
    })
    
  }

  const handleChange = (event) => {
    setName(event.target.value);
  };

  return (
    <Box sx={{ mt: 4 }} {...props}>
      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={4} xs={12}>
              <Typography variant="h6">Basic details</Typography>
            </Grid>
            <Grid item md={8} xs={12}>
              <Box
                sx={{
                  alignItems: "center",
                  display: "flex",
                }}
              >
                <Avatar
                  src={profilePic}
                  sx={{
                    height: 64,
                    mr: 2,
                    width: 64,
                  }}
                >
                  <UserCircleIcon fontSize="small" />
                </Avatar>
                <label htmlFor="save-button-file">
                  <Input
                    accept="image/*"
                    id="save-button-file"
                    multiple
                    type="file"
                    onChange={(e) => {
                      uploadProfilePic(e.target.files[0]);
                    }}
                  />
                  <Button component="span">
                    Select
                  </Button>
                </label>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  mt: 3,
                  alignItems: "center",
                }}
              >
                <TextField
                  value={name}
                  label="Full Name"
                  size="small"
                  sx={{
                    flexGrow: 1,
                    mr: 3,
                  }}
                  onChange={handleChange}
                />
                <Button onClick={changeName}>Save</Button>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  mt: 3,
                  alignItems: "center",
                }}
              >
                <TextField
                  defaultValue="dummy.account@gmail.com"
                  disabled
                  label="Email Address"
                  required
                  size="small"
                  sx={{
                    flexGrow: 1,
                    mr: 3,
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderStyle: "dashed",
                    },
                  }}
                />
                <Button>Edit</Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={4} xs={12}>
              <Typography variant="h6">Public profile</Typography>
            </Grid>
            <Grid item md={8} sm={12} xs={12}>
              <Box
                sx={{
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 3,
                }}
              >
                <div>
                  <Typography variant="subtitle1">
                    Make Contact Info Public
                  </Typography>
                  <Typography
                    color="textSecondary"
                    sx={{ mt: 1 }}
                    variant="body2"
                  >
                    Means that anyone viewing your profile will be able to see
                    your contacts details.
                  </Typography>
                </div>
                <Switch />
              </Box>
              <Divider />
              <Box
                sx={{
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "space-between",
                  mt: 3,
                }}
              >
                <div>
                  <Typography variant="subtitle1">Available to hire</Typography>
                  <Typography
                    color="textSecondary"
                    sx={{ mt: 1 }}
                    variant="body2"
                  >
                    Toggling this will let your teammates know that you are
                    available for acquiring new projects.
                  </Typography>
                </div>
                <Switch defaultChecked />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={4} xs={12}>
              <Typography variant="h6">Delete Account</Typography>
            </Grid>
            <Grid item md={8} xs={12}>
              <Typography sx={{ mb: 3 }} variant="subtitle1">
                Delete your account and all of your source data. This is
                irreversible.
              </Typography>
              <Button color="error" variant="outlined">
                Delete account
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};
