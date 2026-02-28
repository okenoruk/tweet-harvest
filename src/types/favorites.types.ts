export interface FavRoot {
  data: FavData
}

export interface FavData {
  favoriters_timeline: FavoritersTimeline
}

export interface FavoritersTimeline {
  timeline: FavTimeline
}

export interface FavTimeline {
  instructions: FavInstruction[]
  responseObjects: FavResponseObjects
}

export interface FavInstruction {
  type: string
  entries: FavEntry[]
}

export interface FavEntry {
  entryId: string
  sortIndex: string
  content: FavContent
}

export interface FavContent {
  entryType: string
  __typename: string
  itemContent?: FavItemContent
  value?: string
  cursorType?: string
  stopOnEmptyResponse?: boolean
}

export interface FavItemContent {
  itemType: string
  __typename: string
  user_results: FavUserResults
  userDisplayType: string
}

export interface FavUserResults {
  result: FavResult
}

export interface FavResult {
  __typename: string
  id: string
  rest_id: string
  affiliates_highlighted_label: FavAffiliatesHighlightedLabel
  has_graduated_access: boolean
  is_blue_verified: boolean
  profile_image_shape: string
  legacy: FavLegacy
  profile_description_language?: string
  professional?: FavProfessional
}

export interface FavAffiliatesHighlightedLabel { }

export interface FavLegacy {
  can_dm: boolean
  can_media_tag: boolean
  created_at: string
  default_profile: boolean
  default_profile_image: boolean
  description: string
  entities: FavEntities
  fast_followers_count: number
  favourites_count: number
  followers_count: number
  friends_count: number
  has_custom_timelines: boolean
  is_translator: boolean
  listed_count: number
  location: string
  media_count: number
  name: string
  normal_followers_count: number
  pinned_tweet_ids_str: string[]
  possibly_sensitive: boolean
  profile_image_url_https: string
  profile_interstitial_type: string
  screen_name: string
  statuses_count: number
  translator_type: string
  verified: boolean
  want_retweets: boolean
  withheld_in_countries: any[]
  profile_banner_url?: string
}

export interface FavEntities {
  description: FavDescription
}

export interface FavDescription {
  urls: any[]
}

export interface FavProfessional {
  rest_id: string
  professional_type: string
  category: FavCategory[]
}

export interface FavCategory {
  id: number
  name: string
  icon_name: string
}

export interface FavResponseObjects {
  feedbackActions: any[]
  immediateReactions: any[]
}
