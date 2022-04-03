import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Box, Grid } from '@mui/material';
import { socialApi } from '../../../__fake-api__/social-api';
import { useMounted } from '../../../hooks/use-mounted';
import { SocialPostAdd } from './social-post-add';
import { SocialPostCard } from './social-post-card';
import { SocialAbout } from './social-about';
import { useMoralis } from 'react-moralis';
import { useAuth } from '../../../hooks/use-auth';

export const SocialTimeline = (props) => {
  const isMounted = useMounted();
  const { profile, ...other } = props;
  
  const [posts, setPosts] = useState([]);
  const {Moralis} = useMoralis()
  
  
  

    

  const getPosts = useCallback(async () => {
    
    try {
      
      const data = await socialApi.getPosts()
      
      
      if (isMounted()) {
        setPosts(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  return (
    <div {...other}>
      <Grid
        container
        spacing={4}
      >
        <Grid
          item
          lg={4}
          xs={12}
        >
          <SocialAbout
            currentCity={profile.currentCity}
            currentJobCompany={profile.currentJobCompany}
            currentJobTitle={profile.currentJobTitle}
            email={profile.email}
            originCity={profile.originCity}
            previousJobCompany={profile.previousJobCompany}
            previousJobTitle={profile.previousJobTitle}
            profileProgress={profile.profileProgress}
            quote={profile.quote}
          />
        </Grid>
        <Grid
          item
          lg={8}
          xs={12}
        >
          <SocialPostAdd />
          
          {posts.map((post) => {
            console.log(post)
            
            return (
              
            <Box
              key={post.id}
              sx={{ mt: 3 }}
            >
              
              <SocialPostCard
                postId={post.id}
                authorAvatar={post.attributes.author.avatar}
                authorName={post.attributes.author.name}
                comments={post.attributes.comments}
                createdAt={post.attributes.createdAt}
                isLiked={post.attributes.isLiked}
                likes={post.attributes.likes}
                media={post.attributes.media}
                message={post.attributes.message}
              />
            </Box>)
          })}
        </Grid>
      </Grid>
    </div>
  );
};

SocialTimeline.propTypes = {
    profile: PropTypes.object.isRequired
};
