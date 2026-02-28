export interface TweetContent {
  __typename: string
  rest_id: string
  core: Core
  unmention_data: UnmentionData
  edit_control: EditControl
  is_translatable: boolean
  views: Views
  source: string
  grok_analysis_button: boolean
  legacy: Legacy2
  quoted_status_result?: QuotedStatusResult
  card?: Card
}

export interface Core {
  user_results: UserResults
}

export interface UserResults {
  result: Result2
}

export interface Result2 {
  __typename: string
  id: string
  rest_id: string
  affiliates_highlighted_label: AffiliatesHighlightedLabel
  avatar: Avatar
  core: Core2
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
  professional?: Professional
}

export interface AffiliatesHighlightedLabel {
  label?: Label
}

export interface Label {
  url: Url
  badge: Badge
  description: string
  userLabelType: string
  userLabelDisplayType: string
}

export interface Url {
  url: string
  urlType: string
}

export interface Badge {
  url: string
}

export interface Avatar {
  image_url: string
}

export interface Core2 {
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
  url?: Url3
}

export interface Description {
  urls: Url2[]
}

export interface Url2 {
  display_url: string
  expanded_url: string
  url: string
  indices: number[]
}

export interface Url3 {
  urls: Url4[]
}

export interface Url4 {
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
  verified_type?: string
}

export interface Professional {
  rest_id: string
  professional_type: string
  category: Category[]
}

export interface Category {
  id: number
  name: string
  icon_name: string
}

export interface UnmentionData { }

export interface EditControl {
  edit_tweet_ids: string[]
  editable_until_msecs: string
  is_edit_eligible: boolean
  edits_remaining: string
}

export interface Views {
  count?: string
  state: string
}

export interface Legacy2 {
  bookmark_count: number
  bookmarked: boolean
  created_at: string
  conversation_id_str: string
  display_text_range: number[]
  entities: Entities2
  favorite_count: number
  favorited: boolean
  full_text: string
  is_quote_status: boolean
  lang: string
  quote_count: number
  reply_count: number
  retweet_count: number
  retweeted: boolean
  user_id_str: string
  id_str: string
  in_reply_to_screen_name?: string
  in_reply_to_status_id_str?: string
  in_reply_to_user_id_str?: string
  quoted_status_id_str?: string
  quoted_status_permalink?: QuotedStatusPermalink
  extended_entities?: ExtendedEntities
  possibly_sensitive?: boolean
  possibly_sensitive_editable?: boolean
  place?: Place
}

export interface Entities2 {
  hashtags: any[]
  symbols: any[]
  timestamps: any[]
  urls: Url5[]
  user_mentions: UserMention[]
  media?: Medum[]
}

export interface Url5 {
  display_url: string
  expanded_url: string
  url: string
  indices: number[]
}

export interface UserMention {
  id_str: string
  name: string
  screen_name: string
  indices: number[]
}

export interface Medum {
  display_url: string
  expanded_url: string
  id_str: string
  indices: number[]
  media_key: string
  media_url_https: string
  type: string
  url: string
  additional_media_info?: AdditionalMediaInfo
  ext_media_availability: ExtMediaAvailability
  sizes: Sizes
  original_info: OriginalInfo
  allow_download_status?: AllowDownloadStatus
  video_info?: VideoInfo
  media_results: MediaResults
  features?: Features
}

export interface AdditionalMediaInfo {
  monetizable: boolean
}

export interface ExtMediaAvailability {
  status: string
}

export interface Sizes {
  large: Large
  medium: Medium
  small: Small
  thumb: Thumb
}

export interface Large {
  h: number
  w: number
  resize: string
}

export interface Medium {
  h: number
  w: number
  resize: string
}

export interface Small {
  h: number
  w: number
  resize: string
}

export interface Thumb {
  h: number
  w: number
  resize: string
}

export interface OriginalInfo {
  height: number
  width: number
  focus_rects: FocusRect[]
}

export interface FocusRect {
  x: number
  y: number
  w: number
  h: number
}

export interface AllowDownloadStatus {
  allow_download: boolean
}

export interface VideoInfo {
  aspect_ratio: number[]
  duration_millis: number
  variants: Variant[]
}

export interface Variant {
  content_type: string
  url: string
  bitrate?: number
}

export interface MediaResults {
  result: Result3
}

export interface Result3 {
  media_key: string
}

export interface Features {
  large: Large2
  medium: Medium2
  small: Small2
  orig: Orig
}

export interface Large2 {
  faces: Face[]
}

export interface Face {
  x: number
  y: number
  h: number
  w: number
}

export interface Medium2 {
  faces: Face2[]
}

export interface Face2 {
  x: number
  y: number
  h: number
  w: number
}

export interface Small2 {
  faces: Face3[]
}

export interface Face3 {
  x: number
  y: number
  h: number
  w: number
}

export interface Orig {
  faces: Face4[]
}

export interface Face4 {
  x: number
  y: number
  h: number
  w: number
}

export interface QuotedStatusPermalink {
  url: string
  expanded: string
  display: string
}

export interface ExtendedEntities {
  media: Medum2[]
}

export interface Medum2 {
  display_url: string
  expanded_url: string
  id_str: string
  indices: number[]
  media_key: string
  media_url_https: string
  type: string
  url: string
  additional_media_info?: AdditionalMediaInfo2
  ext_media_availability: ExtMediaAvailability2
  sizes: Sizes2
  original_info: OriginalInfo2
  allow_download_status?: AllowDownloadStatus2
  video_info?: VideoInfo2
  media_results: MediaResults2
  features?: Features2
}

export interface AdditionalMediaInfo2 {
  monetizable: boolean
}

export interface ExtMediaAvailability2 {
  status: string
}

export interface Sizes2 {
  large: Large3
  medium: Medium3
  small: Small3
  thumb: Thumb2
}

export interface Large3 {
  h: number
  w: number
  resize: string
}

export interface Medium3 {
  h: number
  w: number
  resize: string
}

export interface Small3 {
  h: number
  w: number
  resize: string
}

export interface Thumb2 {
  h: number
  w: number
  resize: string
}

export interface OriginalInfo2 {
  height: number
  width: number
  focus_rects: FocusRect2[]
}

export interface FocusRect2 {
  x: number
  y: number
  w: number
  h: number
}

export interface AllowDownloadStatus2 {
  allow_download: boolean
}

export interface VideoInfo2 {
  aspect_ratio: number[]
  duration_millis: number
  variants: Variant2[]
}

export interface Variant2 {
  content_type: string
  url: string
  bitrate?: number
}

export interface MediaResults2 {
  result: Result4
}

export interface Result4 {
  media_key: string
}

export interface Features2 {
  large: Large4
  medium: Medium4
  small: Small4
  orig: Orig2
}

export interface Large4 {
  faces: Face5[]
}

export interface Face5 {
  x: number
  y: number
  h: number
  w: number
}

export interface Medium4 {
  faces: Face6[]
}

export interface Face6 {
  x: number
  y: number
  h: number
  w: number
}

export interface Small4 {
  faces: Face7[]
}

export interface Face7 {
  x: number
  y: number
  h: number
  w: number
}

export interface Orig2 {
  faces: Face8[]
}

export interface Face8 {
  x: number
  y: number
  h: number
  w: number
}

export interface Place {
  bounding_box: BoundingBox
  country: string
  country_code: string
  full_name: string
  name: string
  id: string
  place_type: string
  url: string
}

export interface BoundingBox {
  coordinates: number[][][]
  type: string
}

export interface QuotedStatusResult {
  result: Result5
}

export interface Result5 {
  __typename: string
  rest_id: string
  core: Core3
  unmention_data: UnmentionData2
  edit_control: EditControl2
  is_translatable: boolean
  views: Views2
  source: string
  grok_analysis_button: boolean
  legacy: Legacy4
  post_video_description?: string
  quotedRefResult?: QuotedRefResult
}

export interface Core3 {
  user_results: UserResults2
}

export interface UserResults2 {
  result: Result6
}

export interface Result6 {
  __typename: string
  id: string
  rest_id: string
  affiliates_highlighted_label: AffiliatesHighlightedLabel2
  avatar: Avatar2
  core: Core4
  dm_permissions: DmPermissions2
  has_graduated_access: boolean
  is_blue_verified: boolean
  legacy: Legacy3
  location: Location2
  media_permissions: MediaPermissions2
  parody_commentary_fan_label: string
  profile_image_shape: string
  privacy: Privacy2
  relationship_perspectives: RelationshipPerspectives2
  tipjar_settings: TipjarSettings2
  verification: Verification2
}

export interface AffiliatesHighlightedLabel2 { }

export interface Avatar2 {
  image_url: string
}

export interface Core4 {
  created_at: string
  name: string
  screen_name: string
}

export interface DmPermissions2 {
  can_dm: boolean
  can_dm_on_xchat: boolean
}

export interface Legacy3 {
  default_profile: boolean
  default_profile_image: boolean
  description: string
  entities: Entities3
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
  profile_banner_url: string
  profile_interstitial_type: string
  statuses_count: number
  translator_type: string
  want_retweets: boolean
  withheld_in_countries: any[]
  url?: string
}

export interface Entities3 {
  description: Description2
  url?: Url6
}

export interface Description2 {
  urls: any[]
}

export interface Url6 {
  urls: Url7[]
}

export interface Url7 {
  display_url: string
  expanded_url: string
  url: string
  indices: number[]
}

export interface Location2 {
  location: string
}

export interface MediaPermissions2 {
  can_media_tag: boolean
}

export interface Privacy2 {
  protected: boolean
}

export interface RelationshipPerspectives2 {
  following: boolean
}

export interface TipjarSettings2 { }

export interface Verification2 {
  verified: boolean
}

export interface UnmentionData2 { }

export interface EditControl2 {
  edit_tweet_ids: string[]
  editable_until_msecs: string
  is_edit_eligible: boolean
  edits_remaining: string
}

export interface Views2 {
  count: string
  state: string
}

export interface Legacy4 {
  bookmark_count: number
  bookmarked: boolean
  created_at: string
  conversation_id_str: string
  display_text_range: number[]
  entities: Entities4
  favorite_count: number
  favorited: boolean
  full_text: string
  in_reply_to_screen_name?: string
  in_reply_to_status_id_str?: string
  in_reply_to_user_id_str?: string
  is_quote_status: boolean
  lang: string
  quote_count: number
  reply_count: number
  retweet_count: number
  retweeted: boolean
  user_id_str: string
  id_str: string
  extended_entities?: ExtendedEntities2
  possibly_sensitive?: boolean
  possibly_sensitive_editable?: boolean
  quoted_status_id_str?: string
  quoted_status_permalink?: QuotedStatusPermalink2
}

export interface Entities4 {
  hashtags: any[]
  symbols: any[]
  timestamps: any[]
  urls: any[]
  user_mentions: UserMention2[]
  media?: Medum3[]
}

export interface UserMention2 {
  id_str: string
  name: string
  screen_name: string
  indices: number[]
}

export interface Medum3 {
  display_url: string
  expanded_url: string
  id_str: string
  indices: number[]
  media_key: string
  media_url_https: string
  type: string
  url: string
  additional_media_info: AdditionalMediaInfo3
  ext_media_availability: ExtMediaAvailability3
  sizes: Sizes3
  original_info: OriginalInfo3
  allow_download_status: AllowDownloadStatus3
  video_info: VideoInfo3
  media_results: MediaResults3
}

export interface AdditionalMediaInfo3 {
  monetizable: boolean
}

export interface ExtMediaAvailability3 {
  status: string
}

export interface Sizes3 {
  large: Large5
  medium: Medium5
  small: Small5
  thumb: Thumb3
}

export interface Large5 {
  h: number
  w: number
  resize: string
}

export interface Medium5 {
  h: number
  w: number
  resize: string
}

export interface Small5 {
  h: number
  w: number
  resize: string
}

export interface Thumb3 {
  h: number
  w: number
  resize: string
}

export interface OriginalInfo3 {
  height: number
  width: number
  focus_rects: any[]
}

export interface AllowDownloadStatus3 {
  allow_download: boolean
}

export interface VideoInfo3 {
  aspect_ratio: number[]
  duration_millis: number
  variants: Variant3[]
}

export interface Variant3 {
  content_type: string
  url: string
  bitrate?: number
}

export interface MediaResults3 {
  result: Result7
}

export interface Result7 {
  media_key: string
}

export interface ExtendedEntities2 {
  media: Medum4[]
}

export interface Medum4 {
  display_url: string
  expanded_url: string
  id_str: string
  indices: number[]
  media_key: string
  media_url_https: string
  type: string
  url: string
  additional_media_info: AdditionalMediaInfo4
  ext_media_availability: ExtMediaAvailability4
  sizes: Sizes4
  original_info: OriginalInfo4
  allow_download_status: AllowDownloadStatus4
  video_info: VideoInfo4
  media_results: MediaResults4
}

export interface AdditionalMediaInfo4 {
  monetizable: boolean
}

export interface ExtMediaAvailability4 {
  status: string
}

export interface Sizes4 {
  large: Large6
  medium: Medium6
  small: Small6
  thumb: Thumb4
}

export interface Large6 {
  h: number
  w: number
  resize: string
}

export interface Medium6 {
  h: number
  w: number
  resize: string
}

export interface Small6 {
  h: number
  w: number
  resize: string
}

export interface Thumb4 {
  h: number
  w: number
  resize: string
}

export interface OriginalInfo4 {
  height: number
  width: number
  focus_rects: any[]
}

export interface AllowDownloadStatus4 {
  allow_download: boolean
}

export interface VideoInfo4 {
  aspect_ratio: number[]
  duration_millis: number
  variants: Variant4[]
}

export interface Variant4 {
  content_type: string
  url: string
  bitrate?: number
}

export interface MediaResults4 {
  result: Result8
}

export interface Result8 {
  media_key: string
}

export interface QuotedStatusPermalink2 {
  url: string
  expanded: string
  display: string
}

export interface QuotedRefResult {
  result: Result9
}

export interface Result9 {
  __typename: string
  rest_id: string
}

export interface Card {
  rest_id: string
  legacy: Legacy5
}

export interface Legacy5 {
  binding_values: BindingValue[]
  card_platform: CardPlatform
  name: string
  url: string
  user_refs_results: UserRefsResult[]
}

export interface BindingValue {
  key: string
  value: Value
}

export interface Value {
  string_value?: string
  type: string
  image_value?: ImageValue
  scribe_key?: string
  user_value?: UserValue
  image_color_value?: ImageColorValue
}

export interface ImageValue {
  height: number
  width: number
  url: string
}

export interface UserValue {
  id_str: string
  path: any[]
}

export interface ImageColorValue {
  palette: Palette[]
}

export interface Palette {
  rgb: Rgb
  percentage: number
}

export interface Rgb {
  blue: number
  green: number
  red: number
}

export interface CardPlatform {
  platform: Platform
}

export interface Platform {
  audience: Audience
  device: Device
}

export interface Audience {
  name: string
}

export interface Device {
  name: string
  version: string
}

export interface UserRefsResult {
  result: Result10
}

export interface Result10 {
  __typename: string
  id: string
  rest_id: string
  affiliates_highlighted_label: AffiliatesHighlightedLabel3
  avatar: Avatar3
  core: Core5
  dm_permissions: DmPermissions3
  has_graduated_access: boolean
  is_blue_verified: boolean
  legacy: Legacy6
  location: Location3
  media_permissions: MediaPermissions3
  parody_commentary_fan_label: string
  profile_image_shape: string
  privacy: Privacy3
  relationship_perspectives: RelationshipPerspectives3
  tipjar_settings: TipjarSettings3
  verification: Verification3
}

export interface AffiliatesHighlightedLabel3 { }

export interface Avatar3 {
  image_url: string
}

export interface Core5 {
  created_at: string
  name: string
  screen_name: string
}

export interface DmPermissions3 {
  can_dm: boolean
  can_dm_on_xchat: boolean
}

export interface Legacy6 {
  default_profile: boolean
  default_profile_image: boolean
  description: string
  entities: Entities5
  fast_followers_count: number
  favourites_count: number
  followers_count: number
  friends_count: number
  has_custom_timelines: boolean
  is_translator: boolean
  listed_count: number
  media_count: number
  normal_followers_count: number
  pinned_tweet_ids_str: any[]
  possibly_sensitive: boolean
  profile_banner_url: string
  profile_interstitial_type: string
  statuses_count: number
  translator_type: string
  url: string
  want_retweets: boolean
  withheld_in_countries: any[]
}

export interface Entities5 {
  description: Description3
  url: Url8
}

export interface Description3 {
  urls: any[]
}

export interface Url8 {
  urls: Url9[]
}

export interface Url9 {
  display_url: string
  expanded_url: string
  url: string
  indices: number[]
}

export interface Location3 {
  location: string
}

export interface MediaPermissions3 {
  can_media_tag: boolean
}

export interface Privacy3 {
  protected: boolean
}

export interface RelationshipPerspectives3 {
  following: boolean
}

export interface TipjarSettings3 { }

export interface Verification3 {
  verified: boolean
  verified_type: string
}

export interface Highlights {
  textHighlights: TextHighlight[]
}

export interface TextHighlight {
  startIndex: number
  endIndex: number
}

export interface ClientEventInfo {
  component: string
  element: string
  details: Details
}

export interface Details {
  timelinesDetails: TimelinesDetails
}

export interface TimelinesDetails {
  controllerData: string
}


export interface ItemContent {
  itemType: string;
  __typename: string;
  tweet_results: {
    result: TweetContent & {
      tweet?: TweetContent;
    };
  };
  tweetDisplayType: string;
  socialContext: {
    type: string;
    contextType: string;
    text: string;
    landingUrl: {
      url: string;
      urlType: string;
      urtEndpointOptions: {
        title: string;
        requestParams: {
          key: string;
          value: string;
        }[];
      };
    };
  };
}

export interface Entry {
  entryId: string;
  sortIndex: string;
  content: {
    items?: {
      entryId: string;
      item: {
        itemContent: ItemContent;
      };
    }[];
    entryType: string;
    __typename: string;
    itemContent: ItemContent;
    feedbackInfo: {
      feedbackKeys: string[];
      feedbackMetadata: string;
    };
    clientEventInfo: {
      component: string;
      element: string;
      entityToken: string;
      details: {
        timelinesDetails: {
          injectionType: string;
          controllerData: string;
        };
      };
    };
  };
}