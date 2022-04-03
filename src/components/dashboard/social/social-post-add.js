import { useState, useRef } from "react";
import { useAuth } from "../../../hooks/use-auth";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  TextField,
  Input,
} from "@mui/material";
import { Photograph as PhotographIcon } from "../../../icons/photograph";
import { PaperClip as PaperClipIcon } from "../../../icons/paper-clip";
import { Link as LinkIcon } from "../../../icons/link";
import { EmojiHappy as EmojiHappyIcon } from "../../../icons/emoji-happy";
import { getInitials } from "../../../utils/get-initials";
import { useMoralis, useMoralisFile } from "react-moralis";
import { PostAddTwoTone, ResetTvOutlined } from "@mui/icons-material";
import { UserCircle } from "../../../icons/user-circle";

export const SocialPostAdd = (props) => {
  const textInput = useRef(null);
  const { Moralis } = useMoralis();
  const { saveFile } = useMoralisFile();
  const [post, setPost] = useState();
  const [media, setMedia] = useState();

  // To get the user from the authContext, you can use
  const { user } = useAuth();
  // const user = {
  //   avatar: '/static/mock-images/avatars/avatar-anika_visser.png',
  //   name: 'Anika Visser'
  // };
  console.log(user)
  const author = {
    
    id: user.id,
    avatar: user.attributes.profilePic._url,
    name: user.attributes.username,
  };

  const handlePost = async () => {
    // Declare the types.
    const Post = Moralis.Object.extend("Posts");

    const name = media?.name;
    const myResult = new Moralis.File(name, media)
    // Create the post
    const myPost = new Post();
    myPost.set("message", post);
    myPost.set("author", author);
    myPost.set("media", myResult);
    const savedPost = await myPost.save();
    setMedia(null)
    const user = Moralis.User.current();
    const relation = user.relation("posts");
    relation.add(savedPost);
    user.save();
    textInput.current.value = "";
  };

  return (
    <Card {...props}>
      <CardContent sx={{ display: "flex" }}>
        <Avatar
          src={user.attributes.profilePic._url}
          sx={{
            height: 40,
            mr: 2,
            width: 40,
          }}
        >
          {getInitials(user.attributes.username)}
        </Avatar>
        <Box sx={{ flexGrow: 1 }}>
          <TextField
            inputRef={textInput}
            fullWidth
            multiline
            placeholder="What's on your mind"
            rows={3}
            onChange={(e) => {
              setPost(e.target.value);
            }}
          />
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
              justifyContent: "space-between",
              mt: 3,
            }}
          >
            <Box
              sx={{
                display: {
                  xs: "none",
                  md: "block",
                },
                m: -1,
                "& > *": {
                  m: 1,
                },
              }}
            >
              <label htmlFor="icon-button-file">
                <Input
                  accept="image/*"
                  id="icon-button-file"
                  type="file"
                  sx={{ display: "none" }}
                  onChange={(e) => {
                    setMedia(e.target.files[0]);
                  }}
                />
                <IconButton
                  color="primary"
                  aria-label="upload picture"
                  component="span"
                >
                  <PhotographIcon fontSize="small" />
                </IconButton>
              </label>
              <IconButton>
                <PaperClipIcon fontSize="small" />
              </IconButton>
              <IconButton>
                <LinkIcon fontSize="small" />
              </IconButton>
              <IconButton>
                <EmojiHappyIcon fontSize="small" />
              </IconButton>
            </Box>
            <Button onClick={handlePost} variant="contained">
              Post
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
