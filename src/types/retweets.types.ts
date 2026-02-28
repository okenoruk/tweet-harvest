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
  affiliates_highlighted_label: AffiliatesHighlightedLabel
  avatar: Avatar
  core: Core
  dm_permissions: DmPermissions
  follow_request_sent: boolean
  has_graduated_access: boolean
  id: string
  is_blue_verified: boolean
  legacy: Legacy
  location: Location
  media_permissions: MediaPermissions
  parody_commentary_fan_label: string
  privacy: Privacy
  profile_bio: ProfileBio
  profile_description_language: string
  profile_image_shape: string
  relationship_perspectives: RelationshipPerspectives
  rest_id: string
  super_follow_eligible: boolean
  super_followed_by: boolean
  super_following: boolean
  verification: Verification
}

export interface AffiliatesHighlightedLabel { }

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
}

export interface Legacy {
  default_profile: boolean
  default_profile_image: boolean
  description: string
  entities: Entities
  fast_followers_count: number
  favourites_count: number
  follow_request_sent: boolean
  followers_count: number
  friends_count: number
  has_custom_timelines: boolean
  is_translator: boolean
  listed_count: number
  media_count: number
  normal_followers_count: number
  notifications: boolean
  pinned_tweet_ids_str: any[]
  possibly_sensitive: boolean
  profile_banner_url: string
  profile_interstitial_type: string
  statuses_count: number
  translator_type: string
  want_retweets: boolean
  withheld_in_countries: any[]
}

export interface Entities {
  description: Description
}

export interface Description {
  urls: any[]
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

export interface ProfileBio {
  description: string
}

export interface RelationshipPerspectives {
  blocked_by: boolean
  blocking: boolean
  followed_by: boolean
  following: boolean
  muting: boolean
}

export interface Verification {
  verified: boolean
}

export interface ResponseObjects {
  feedbackActions: any[]
  immediateReactions: any[]
}
