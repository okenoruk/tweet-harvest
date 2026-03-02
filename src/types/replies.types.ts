// Types for the TweetDetail API response (replies)

export interface ReplyTweetResult {
    __typename: string;
    rest_id: string;
    core: {
        user_results: {
            result: ReplyUserResult;
        };
    };
    legacy: ReplyTweetLegacy;
    views?: {
        count: string;
        state: string;
    };
}

export interface ReplyUserResult {
    __typename: string;
    rest_id: string;
    core: {
        created_at: string;
        name: string;
        screen_name: string;
    };
    avatar?: {
        image_url: string;
    };
    legacy: {
        description: string;
        followers_count: number;
        friends_count: number;
        statuses_count: number;
        favourites_count: number;
        profile_image_url_https?: string;
    };
    location?: {
        location: string;
    };
    is_blue_verified?: boolean;
    profile_description_language?: string;
}

export interface ReplyTweetLegacy {
    conversation_id_str: string;
    created_at: string;
    full_text: string;
    id_str: string;
    user_id_str: string;
    favorite_count: number;
    reply_count: number;
    retweet_count: number;
    quote_count: number;
    bookmark_count: number;
    lang: string;
    in_reply_to_screen_name?: string;
    in_reply_to_status_id_str?: string;
    in_reply_to_user_id_str?: string;
    entities?: {
        user_mentions?: Array<{
            id_str: string;
            name: string;
            screen_name: string;
        }>;
        media?: Array<{
            media_url_https: string;
        }>;
    };
}

export interface ReplyEntry {
    entryId: string;
    sortIndex: string;
    content: {
        __typename: string;
        entryType: string;
        // For TimelineTimelineModule (conversation thread with replies)
        items?: Array<{
            entryId: string;
            item: {
                itemContent: {
                    __typename: string;
                    itemType: string;
                    tweet_results: {
                        result: ReplyTweetResult;
                    };
                };
            };
        }>;
        // For TimelineTimelineItem (single tweet)
        itemContent?: {
            tweet_results: {
                result: ReplyTweetResult;
            };
        };
        // For cursors
        cursorType?: string;
        value?: string;
    };
}
