import { useRef, useState } from 'react';
import { Avatar, Box, Button, IconButton, TextField } from '@mui/material';
import { EmojiHappy as EmojiHappyIcon } from '../../../icons/emoji-happy';
import { Link as LinkIcon } from '../../../icons/link';
import { PaperClip as PaperClipIcon } from '../../../icons/paper-clip';
import { Photograph as PhotographIcon } from '../../../icons/photograph';
import { Plus as PlusIcon } from '../../../icons/plus';
import { getInitials } from '../../../utils/get-initials';
import { useAuth } from '../../../hooks/use-auth';
import Moralis from 'moralis'

export const SocialCommentAdd = (props) => {
  const textInput = useRef(null);
  const [message, setMessage] = useState()
  const {user, profile} = useAuth()
  // To get the user from the authContext, you can use
  // `const { user } = useAuth();`
  // const user = {
  //   avatar: '/static/mock-images/avatars/avatar-anika_visser.png',
  //   name: 'Anika Visser'
  // };
  console.log(props)
  
  const author = {
    id: user.id,
    avatar: profile.attributes.avatar._url,
    name: user.attributes.username,
  };

  const handleComment = async () => {
    // Declare the types.
    const Comment = Moralis.Object.extend("Comments");

    // const name = media.name;
    // const myResult = new Moralis.File(name, media)
    // Create the comment
    const myComment = new Comment();
    myComment.set("message", message);
    myComment.set("author", author);
    //myComment.set("media", myResult);
    const savedComment = await myComment.save();
    const user = Moralis.User.current()
    const tester = user.relation('posts')
    
    const Posts = Moralis.Object.extend('Posts')
    const query = new Moralis.Query(Posts)
    const post = await query.get(props.postId)
    
    const relation = post.relation('comments')
    relation.add(savedComment)
    post.save();
    textInput.current.value = "";
  };

  return (
    <div {...props}>
      <Box sx={{ display: 'flex' }}>
        <Avatar
          src={profile.attributes.avatar._url}
          sx={{
            height: 40,
            mr: 2,
            width: 40
          }}
        >
          {getInitials(user.attributes.username)}
        </Avatar>
        <Box sx={{ flexGrow: 1 }}>
          <TextField
            inputRef={textInput}
            fullWidth
            multiline
            placeholder="Type your reply"
            rows={3}
            onChange={(e) => {
              setMessage(e.target.value)
            }}
          />
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'space-between',
              mt: 3
            }}
          >
            <IconButton
              sx={{
                display: {
                  xs: 'inline-flex',
                  sm: 'none'
                }
              }}
            >
              <PlusIcon fontSize="small" />
            </IconButton>
            <Box
              sx={{
                display: {
                  xs: 'none',
                  sm: 'block'
                },
                m: -1,
                '& > *': {
                  m: 1
                }
              }}
            >
              <IconButton>
                <PhotographIcon fontSize="small" />
              </IconButton>
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
            <Button onClick={handleComment} variant="contained">
              Send
            </Button>
          </Box>
        </Box>
      </Box>
    </div>
  );
};
