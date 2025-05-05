import { ChatFillIcon } from "../../components/icons/ChatFillIcon";
import { ChatOutlineIcon } from "../../components/icons/ChatOutlineIcon";
import { SIDEBAR_TITLE } from "../../types/side-bar.type";

export type SideBarLayoutItem = {
  title: SIDEBAR_TITLE;
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
};

export const SIDEBAR_LAYOUT: SideBarLayoutItem[] = [
  // {
  //   title: SIDEBAR_TITLE.HOME,
  //   icon: <HomeOutlineIcon />,
  //   activeIcon: <HomeFillIcon />,
  // },
  // {
  //   title: SIDEBAR_TITLE.SEARCH,
  //   icon: <SearchOutlineIcon />,
  //   activeIcon: <SearchFillIcon />,
  // },
  // {
  //   title: SIDEBAR_TITLE.EXPLORE,
  //   icon: <ExploreOutlineIcon />,
  //   activeIcon: <ExploreFillIcon />,
  // },
  // {
  //   title: SIDEBAR_TITLE.NOTIFICATIONS,
  //   icon: <NotificationOutlineIcon />,
  //   activeIcon: <NotificationFillIcon />,
  // },
  {
    title: SIDEBAR_TITLE.MESSAGES,
    icon: <ChatOutlineIcon />,
    activeIcon: <ChatFillIcon />,
  },
  // {
  //   title: SIDEBAR_TITLE.PROFILE,
  //   icon: <ProfileOutlineIcon />,
  //   activeIcon: <ProfileFillIcon />,
  // },
  // {
  //   title: SIDEBAR_TITLE.CREATE_POST,
  //   icon: <AddFillIcon />,
  //   activeIcon: <AddFillIcon />,
  // },
];
