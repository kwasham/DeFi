import { useCallback, useState, useEffect } from 'react';
import NextLink from 'next/link';
import PropTypes from 'prop-types';
import { formatDistanceToNowStrict, format, parseISO, parseJSON } from 'date-fns';
import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardHeader,
  CardMedia,
  Divider,
  IconButton,
  Link,
  Tooltip,
  Typography
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Clock as ClockIcon } from '../../../icons/clock';
import { Share as ShareIcon } from '../../../icons/share';
import { SocialComment } from './social-comment';
import { SocialCommentAdd } from './social-comment-add';
import { useMounted } from '../../../hooks/use-mounted';


export const SocialPostCard = (props) => {
  const {
    postId,
    authorAvatar,
    authorName,
    comments,
    createdAt,
    isLiked: isLikedProp,
    likes: likesProp,
    media,
    message,
    ...other
  } = props;

  console.log('media', media)

  const date = parseJSON(createdAt)
  const isMounted = useMounted();
  const [expandMedia, setExpandMedia] = useState(false);
  const [comment, setComment] = useState([])
  const [isLiked, setIsLiked] = useState(isLikedProp);
  const [likes, setLikes] = useState(likesProp);

  const getComments = useCallback(async () => {
    try {
      const data = await comments.query().ascending('createdAt').find()

      if (isMounted()) {
        setComment(data)
      }
    } catch (error) {
      console.log(error)
    }
  }, [comments, isMounted])

  useEffect(() => {
    getComments()
  }, [getComments])

  const handleLike = () => {
    setIsLiked(true);
    setLikes((prevLikes) => prevLikes + 1);
  };

  const handleUnlike = () => {
    setIsLiked(false);
    setLikes((prevLikes) => prevLikes - 1);
  };

  return (
    <Card {...other}>
      <CardHeader
        avatar={(
          <NextLink
            href="#"
            passHref
          >
            <Avatar
              component="a"
              src={authorAvatar}
            />
          </NextLink>
        )}
        disableTypography
        subheader={(
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              mt: 1
            }}
          >
            <ClockIcon
              fontSize="small"
              sx={{ color: 'text.secondary' }}
            />
            <Typography
              color="textSecondary"
              sx={{ ml: '6px' }}
              variant="caption"
            >
              {formatDistanceToNowStrict(date)}
              {' '}
              ago
            </Typography>
          </Box>
        )}
        title={(
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex'
            }}
          >
            <NextLink
              href="#"
              passHref
            >
              <Link
                color="textPrimary"
                variant="subtitle2"
              >
                {authorName}
              </Link>
            </NextLink>
            <Typography
              sx={{ ml: 0.5 }}
              variant="body2"
            >
              updated his status
            </Typography>
          </Box>
        )}
      />
      <Box
        sx={{
          pb: 2,
          px: 3
        }}
      >
        <Typography variant="body1">
          {message}
        </Typography>
        {media && (
          <Box sx={{ mt: 3 }}>
            <CardActionArea onClick={() => setExpandMedia(true)}>
              <CardMedia
                image={media._url}
                sx={{
                  backgroundPosition: 'top',
                  height: 500
                }}
              />
            </CardActionArea>
          </Box>
        )}
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            mt: 2
          }}
        >
          {isLiked
            ? (
              <Tooltip title="Unlike">
                <IconButton
                  onClick={handleUnlike}
                  sx={{ color: 'error.main' }}
                >
                  <FavoriteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )
            : (
              <Tooltip title="Like">
                <IconButton onClick={handleLike}>
                  <FavoriteBorderIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          <Typography
            color="textSecondary"
            variant="subtitle2"
          >
            {likes}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton color="primary">
            <ShareIcon fontSize="small" />
          </IconButton>
        </Box>
        <Divider sx={{ my: 3 }} />
        {comment.map((comment) => 
          
          (
          <SocialComment
            authorAvatar={comment.attributes.author.avatar}
            authorName={comment.attributes.author.name}
            createdAt={comment.attributes.createdAt}
            key={comment.id}
            message={comment.attributes.message}
          />
        ))}
        <Divider sx={{ my: 3 }} />
        <SocialCommentAdd postId={props.postId}/>
      </Box>
    </Card>
  );
};

SocialPostCard.propTypes = {
  authorAvatar: PropTypes.string.isRequired,
  authorName: PropTypes.string.isRequired,
  comments: PropTypes.object.isRequired,
  //createdAt: PropTypes.,
  isLiked: PropTypes.bool.isRequired,
  likes: PropTypes.number.isRequired,
  media: PropTypes.string,
  message: PropTypes.string,
  postId: PropTypes.string
};
