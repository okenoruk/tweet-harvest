export interface RetweetRoot {
  data: RetweetData
}

export interface RetweetData {
  retweeters_timeline: RetweetersTimeline
}

export interface RetweetersTimeline {
  timeline: Timeline
}

export interface Timeline {
  instructions: Instruction[]
  responseObjects: ResponseObjects
}

export interface Instruction {
  type: string
  entries: RetweetEntry[]
}

export interface RetweetEntry {
  entryId: string
  sortIndex: string
  content: Content
}

export interface Content {
  entryType: string
  __typename: string
  itemContent?: ItemContent
  value?: string
  cursorType?: string
  stopOnEmptyResponse?: boolean
}

export interface ItemContent {
  itemType: string
  __typename: string
  user_results: UserResults
  userDisplayType: string
}

export interface UserResults {
  result: Result
}

export interface Result {
  __typename: string
  id: string
  rest_id: string
  affiliates_highlighted_label: AffiliatesHighlightedLabel
  avatar: Avatar
  core: Core
  dm_permissions: DmPermissions
  has_graduated_access: boolean
  is_blue_verified: boolean
  legacy: Legacy
  location: Location
  media_permissions: MediaPermissions
  parody_commentary_fan_label: string
  profile_image_shape: string
  privacy: Privacy
  relationship_perspectives: RelationshipPerspectives
  tipjar_settings: TipjarSettings
  verification: Verification
}

export interface AffiliatesHighlightedLabel {}

export interface Avatar {
  image_url: string
}

export interface Core {
  created_at: string
  name: string
  screen_name: string
}

export interface DmPermissions {
  can_dm: boolean
  can_dm_on_xchat: boolean
}

export interface Legacy {
  default_profile: boolean
  default_profile_image: boolean
  description: string
  entities: Entities
  fast_followers_count: number
  favourites_count: number
  followers_count: number
  friends_count: number
  has_custom_timelines: boolean
  is_translator: boolean
  listed_count: number
  media_count: number
  normal_followers_count: number
  pinned_tweet_ids_str: string[]
  possibly_sensitive: boolean
  profile_banner_url?: string
  profile_interstitial_type: string
  statuses_count: number
  translator_type: string
  want_retweets: boolean
  withheld_in_countries: any[]
  url?: string
}

export interface Entities {
  description: Description
  url?: Url
}

export interface Description {
  urls: any[]
}

export interface Url {
  urls: Url2[]
}

export interface Url2 {
  display_url: string
  expanded_url: string
  url: string
  indices: number[]
}

export interface Location {
  location: string
}

export interface MediaPermissions {
  can_media_tag: boolean
}

export interface Privacy {
  protected: boolean
}

export interface RelationshipPerspectives {
  following: boolean
}

export interface TipjarSettings {
  is_enabled?: boolean
}

export interface Verification {
  verified: boolean
}

export interface ResponseObjects {
  feedbackActions: any[]
  immediateReactions: any[]
}
