declare module 'react-twitter-embed' {
  type TwitterTweetEmbedProps = {
    tweetId: string;
    placeholder?: React.ReactNode;
    options?: {
        width?: number;
        height?: number;
    };
  }

  export function TwitterTweetEmbed(props: TwitterTweetEmbedProps);
}
