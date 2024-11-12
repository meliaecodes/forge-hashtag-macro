import React, { useEffect, useState } from 'react';
import ForgeReconciler, { Box, Heading, Link, Image, Inline, Stack, xcss, Label, Textfield } from '@forge/react';
import { invoke, view } from '@forge/bridge';


const Config = () => {
    return (
      <>
        <Label>Hashtag</Label>
        <Textfield name="hashtag" />
      </>
    );
  };
const App = () => {
  const [hashtag, setHashtag] = useState(null);
  const [hashtagName, setHashtagName] = useState(null);
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    invoke('getUser').then(setUser);
  }, []);

  useEffect(() => {
    console.log(user)  
    if(user) {
      console.log(user.accounts.data.length)
      // hard coding the hashtag for now - instagram has a limit on the number of searches
      // a user can undertake in a 7 day period so we're going to prevent the user from
      // exceeding this by limiting it via hard coding
      invoke('getHashtag', { search: 'catlassians', user: user.accounts.data[0].instagram_business_account.id }).then(setHashtag);
    }
  }, [user]);


  useEffect(() => {
    console.log(hashtag)  
    if(hashtag) {
      console.log(hashtag.data.length)
      invoke('getHashtagName', { id: hashtag.data[0].id}).then(setHashtagName);
      // lazily using the first option in the list, rather than having the user actually select from listed options
      invoke('getPosts', { id: hashtag.data[0].id, user: user.accounts.data[0].instagram_business_account.id }).then(setData);
    }
  }, [hashtag]);

  useEffect(() => {
    if(data) {
      console.log(data)  
      console.log(data.data.length)
    }
    console.log(data)  

  }, [data]);


  function Card(post) {
    return (
      <>
        <Box>
          <Stack>
            <Link href={post.permalink}><Image size="large" src={post.media_url} alt={post.caption}></Image></Link>
          </Stack>
        </Box>
      </>
    )
  }

  function CardGroup(posts) {
    return (
      <>
        <Box>
          <Inline alignInline="center">
            {posts.slice(0,4).map(post => (Card(post)))}
          </Inline>
        </Box>
      </>
    )
  }

  return (
    <>
      <Heading as="h2">{hashtagName ? ('#' + hashtagName.name) : 'Loading...'}</Heading>
      <Box xcss={{width: '100%'}}>{data ? CardGroup(data.data) : 'Loading...'}</Box>
    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

ForgeReconciler.addConfig(<Config />)
