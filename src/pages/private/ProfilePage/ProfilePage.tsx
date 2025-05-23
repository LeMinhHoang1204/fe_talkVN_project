import { enqueueSnackbar } from "notistack";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import ActionButton from "../../../components/ActionButton";
import ImageWithFallback from "../../../components/ImageWithFallback";
import Tabs, { Tab } from "../../../components/Tabs";
import { GlobalState } from "../../../data/global/global.slice";
import { useGetUserPostsQuery } from "../../../data/post/post.api";
import {
  useGetFollowersQuery,
  useGetFollowingsQuery,
  useGetProfileDetailQuery,
  useToggleFollowMutation,
} from "../../../data/profile/profile.api";
import { useAppSelector } from "../../../hooks/reduxHooks";
import FollowModal from "./components/FollowModal";
import PostTab from "./components/PostTab";
import SavedTab from "./components/SavedTab";
import TaggedTab from "./components/TaggedTab";

export const GET_POST_PROFILE_PAGE_SIZE = 9999;

function ProfilePage() {
  const { userInfo }: GlobalState = useAppSelector((state) => state.global);

  const { id } = useParams<{ id: string }>();

  const { data: userDetailData } = useGetProfileDetailQuery(id ?? "0", {
    skip: !id,
  });

  const { data: userPosts } = useGetUserPostsQuery({
    UserId: id || "",
    PageIndex: 0,
    PageSize: GET_POST_PROFILE_PAGE_SIZE,
  });

  const tabs: Tab[] = useMemo(() => {
    return [
      {
        label: "Posts",
        content: <PostTab data={userPosts?.data} />,
      },
      {
        label: "Saved",
        content: <SavedTab />,
      },
      {
        label: "Tagged",
        content: <TaggedTab />,
      },
    ];
  }, [userPosts?.data]);

  const [toggleFollow] = useToggleFollowMutation();

  const handleToggleFollow = () => {
    toggleFollow(id || "0")
      .unwrap()
      .then(() => {
        if (userDetailData?.isFollowed) {
          enqueueSnackbar("Unfollowed successfully", { variant: "success" });
        } else {
          enqueueSnackbar("Followed successfully", { variant: "success" });
        }
      })
      .catch(() => {
        enqueueSnackbar(
          "Something went wrong, Please re-login and try again!",
          { variant: "error" }
        );
      });
  };

  const { data: userFollowers } = useGetFollowersQuery(id || "0", {
    skip: !id,
  });

  const { data: userFollowings } = useGetFollowingsQuery(id || "0", {
    skip: !id,
  });

  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
  const [isFollowingsModalOpen, setIsFollowingsModalOpen] = useState(false);

  return (
    <div className="flex w-full h-full justify-center overflow-auto">
      <div className="max-w-5xl flex flex-col">
        <div className="flex flex-row justify-between gap-16 items-center mt-16 px-6">
          {userDetailData && (
            <ImageWithFallback
              className="w-36 h-36 rounded-full"
              alt="Profile"
              src={userDetailData.profileImage.url}
            />
          )}
          <div className="flex flex-col">
            <div className="flex flex-row justify-between items-center gap-12">
              <div className="text-lg font-medium">
                @{userDetailData?.username}
              </div>
              {
                // Add ActionButton component here
                userDetailData?.id === userInfo.userId && (
                  <>
                    <ActionButton title="Edit Profile" onClick={() => {}} />
                  </>
                )
              }
              {userDetailData?.id !== userInfo.userId && (
                <>
                  <ActionButton
                    title={userDetailData?.isFollowed ? "Following" : "Follow"}
                    onClick={handleToggleFollow}
                  />
                </>
              )}
            </div>
            <div className="flex flex-row gap-16 mt-4">
              <div className="flex flex-row gap-1">
                <span className="font-semibold">{userPosts?.data.length}</span>{" "}
                Posts
              </div>
              <button
                onClick={() => {
                  setIsFollowersModalOpen(true);
                }}
                className="flex flex-row gap-1"
              >
                <span className="font-semibold">
                  {userFollowers?.length || 0}
                </span>
                Followers
              </button>
              <button
                onClick={() => {
                  setIsFollowingsModalOpen(true);
                }}
                className="flex flex-row gap-1"
              >
                <span className="font-semibold">
                  {userFollowings?.length || 0}
                </span>
                Followings
              </button>
            </div>
            {userDetailData && (
              <>
                <div className="font-medium text-lg mt-8">
                  {userDetailData.userDisplayName}
                </div>
                <div>{userDetailData.bio}</div>
              </>
            )}
            <FollowModal
              isOpen={isFollowersModalOpen}
              data={userFollowers || []}
              onClose={() => {
                setIsFollowersModalOpen(false);
              }}
              title="Followers"
            />
            <FollowModal
              isOpen={isFollowingsModalOpen}
              data={userFollowings || []}
              onClose={() => {
                setIsFollowingsModalOpen(false);
              }}
              title="Followings"
            />
          </div>
        </div>
        <div className="mt-16">
          <Tabs tabs={tabs} />
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
