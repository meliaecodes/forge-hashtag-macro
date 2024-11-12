import Resolver from '@forge/resolver';
import api, { fetch } from '@forge/api'
import { hash } from 'crypto';

const resolver = new Resolver();

resolver.define('getPosts', async (req) => {
  console.log("getPosts")

  const ravelry = api.asUser().withProvider('instagram', 'facebook-graph')
  if(!await ravelry.hasCredentials()) {
    console.log("requesting credentials")
    await ravelry.requestCredentials()
  }

  const response = await ravelry.fetch('/' + req.payload.id + '/top_media?user_id=' + req.payload.user + '&fields=id,media_type,permalink,caption,like_count,timestamp,media_url')
  if (response.ok) {
    const posts = await response.json()
    console.log('getPosts')
    return(posts);
    
  } else {
    return {
      status: response.status,
      statusText: response.statusText,
      text: await response.text(),
    }
  } 
});

resolver.define('getHashtagName', async (req) => {

  const ravelry = api.asUser().withProvider('instagram', 'facebook-graph')
  if(!await ravelry.hasCredentials()) {
    console.log("requesting credentials")
    await ravelry.requestCredentials()
  }

  const response = await ravelry.fetch('/' + req.payload.id + '?fields=id,name')
  if (response.ok) {
    const hashtag_name = await response.json()

    return(hashtag_name);
    
  } else {
    return {
      status: response.status,
      statusText: response.statusText,
      text: await response.text(),
    }
  } 
});

resolver.define('getHashtag', async (req) => {
  console.log("getHashtag")
  console.log(req);

  const ravelry = api.asUser().withProvider('instagram', 'facebook-graph')
  if(!await ravelry.hasCredentials()) {
    console.log("requesting credentials")
    await ravelry.requestCredentials()
  }

  let search = req.payload.search

  if(req.context.extension.config){
    search = req.context.extension.config.hashtag
  } 

  console.log("search: " + search)
  const response = await ravelry.fetch('/ig_hashtag_search?user_id=' + req.payload.user + '&q=' + search)
  if (response.ok) {
    const hashtag_id = await response.json()
    console.log('getHashtag id')
    console.log(hashtag_id)
    return(hashtag_id);
    
  } else {
    return {
      status: response.status,
      statusText: response.statusText,
      text: await response.text(),
    }
  } 
});

resolver.define('getUser', async (req) => {
  console.log("getUser")
  console.log(req);

  const ravelry = api.asUser().withProvider('instagram', 'facebook-graph')
  if(!await ravelry.hasCredentials()) {
    console.log("requesting credentials")
    await ravelry.requestCredentials()
  }

  const response = await ravelry.fetch('/me?fields=accounts{instagram_business_account},id,name') 
  if (response.ok) {
    const user = await response.json()
    console.log('getUser user')
    console.log(user)
    return user;
    
  } else {
    return {
      status: response.status,
      statusText: response.statusText,
      text: await response.text(),
    }
  }
});


resolver.define('getText', (req) => {
  console.log(req);

  return 'Hello, world!';
});

export const handler = resolver.getDefinitions();
