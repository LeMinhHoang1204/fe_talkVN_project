import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import PostCard from "../../../components/PostCard";
import UserSummarySuggestCard from "../../../components/UserSummarySuggestCard";
import { GlobalState } from "../../../data/global/global.slice";
import { useGetPostsQuery } from "../../../data/post/post.api";
import { GetListPostREQ } from "../../../data/post/post.request";
import { useGetRecommendUsersQuery } from "../../../data/profile/profile.api";
import { APP_ROUTE } from "../../../helpers/constants/route.constant";
import { useAppSelector } from "../../../hooks/reduxHooks";
import { useBreakpoint } from "../../../hooks/useBreakPoint";
import { PostDTO } from "../../../types/data.type";
import PostDetailModal from "../components/PostDetailModal";
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
    <div className="flex items-start">
      <WelcomePage />
    </div>
  );
}

export default HomePage;
