import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
// Update the import path below to the correct location of ChannelSidebar.tsx
import { GlobalState } from "../../../data/global/global.slice";
import { useGetPostsQuery } from "../../../data/post/post.api";
import { GetListPostREQ } from "../../../data/post/post.request";
import { useGetRecommendUsersQuery } from "../../../data/profile/profile.api";
import { useAppSelector } from "../../../hooks/reduxHooks";
import { useBreakpoint } from "../../../hooks/useBreakPoint";
import { PostDTO } from "../../../types/data.type";
import ChannelSidebar from "../Home/ChannelSideBar";
import WelcomePage from "../Home/WelcomePage";

export const GET_POST_HOME_PAGE_SIZE = 3;

function HomePage() {
  const scrollableRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { userInfo }: GlobalState = useAppSelector((state) => state.global);
  const { isLg: isScreenLargerThanLg } = useBreakpoint("lg");

  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const [postDataPagination, setPostDataPagination] = useState<PostDTO[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);

  const getHomePostsREQ: GetListPostREQ = {
    PageIndex: currentPageIndex,
    PageSize: GET_POST_HOME_PAGE_SIZE,
  };
  const {
    data: postData,
    isLoading: isPostDataLoading,
    isFetching: isPostDataFetching,
  } = useGetPostsQuery(getHomePostsREQ);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !isPostDataFetching &&
          !isPostDataLoading &&
          postData?.data.length === GET_POST_HOME_PAGE_SIZE
        ) {
          console.log("Load more triggered");
          setCurrentPageIndex((prev) => prev + 1);
        }
      },
      {
        root: scrollableRef.current,
        threshold: 1,
      }
    );

    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }

    return () => {
      if (bottomRef.current) {
        observer.unobserve(bottomRef.current);
      }
    };
  }, [isPostDataFetching, isPostDataLoading, postData?.data.length]);

  useEffect(() => {
    if (postData) {
      setPostDataPagination((prev) => {
        const existingIds = new Set(prev.map((post) => post.id));
        const newPosts = postData.data.filter(
          (post) => !existingIds.has(post.id)
        );
        return [...prev, ...newPosts];
      });
    }
  }, [postData, postData?.data]);

  const { data: recommendUsers } = useGetRecommendUsersQuery({
    PageIndex: 0,
    PageSize: 5,
  });

  const navigate = useNavigate();
  return (
    <div className="flex">
      <div className="w-[18%] bg-[#2b2d31]">
        <ChannelSidebar />
      </div>
      <div className="flex items-start flex-1">
        <WelcomePage />
      </div>
    </div>
  );
}

export default HomePage;
