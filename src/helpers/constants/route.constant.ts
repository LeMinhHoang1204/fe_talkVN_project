export enum ROUTE_NAME {
  MAIN = "",
  AUTH = "auth",
}

export const APP_ROUTE = {
  AUTH: {
    self: ROUTE_NAME.AUTH,
    LOGIN: `/${ROUTE_NAME.AUTH}/login`,
    SIGNUP: `/${ROUTE_NAME.AUTH}/signup`,
    GOOGLE_CALLBACK: `/${ROUTE_NAME.AUTH}/google/callback`,
  },
  MAIN: {
    self: ROUTE_NAME.MAIN,
    HOME: `${ROUTE_NAME.MAIN}/home`,
    EXPLORE: `${ROUTE_NAME.MAIN}/explore`,
    MESSAGES: `${ROUTE_NAME.MAIN}/messages`,
    PROFILE: (id: string) => `${ROUTE_NAME.MAIN}/profile/${id}`,
    SEARCH_POST: `${ROUTE_NAME.MAIN}/search-post`,
    VIDEO: (conversationId: string) =>
      `${ROUTE_NAME.MAIN}/video/${conversationId}`,
    GROUP: (groupId: string) => `/group/${groupId}`,
  },

  FULL_SCREEN: {
    VIDEO: (conversationId: string) =>
      `${ROUTE_NAME.MAIN}/video/${conversationId}`,
  },
};
