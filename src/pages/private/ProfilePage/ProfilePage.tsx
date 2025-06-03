import { enqueueSnackbar } from "notistack";
import { useCallback, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { Tab } from "../../../components/Tabs";
import { logoutThunk } from "../../../data/auth/auth.thunk";
import { GlobalState } from "../../../data/global/global.slice";
import { useGetUserPostsQuery } from "../../../data/post/post.api";
import {
  useGetFollowersQuery,
  useGetFollowingsQuery,
  useGetProfileDetailQuery,
  useToggleFollowMutation,
} from "../../../data/profile/profile.api";
import { useAppSelector } from "../../../hooks/reduxHooks";
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
  console.log("id param:", id);
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

  const dispatch = useDispatch();

  const handleLogout = useCallback(() => {
    dispatch(logoutThunk());
  }, [dispatch]);

  return (
    <div className="flex h-full w-full bg-gray-900 text-white">
      {/* Main content */}
      <div className="flex-1 flex p-10 gap-10">
        {/* Left Menu */}
        <div className="w-48 flex flex-col gap-4">
          <button className="bg-gray-700 py-2 px-4 rounded text-left">
            My account
          </button>
          <button
            className="text-left flex gap-2 items-center text-red-400"
            onClick={handleLogout}
          >
            Log Out <span></span>
          </button>
        </div>

        {/* Profile Form */}
        <div className="flex-1 flex flex-col items-center bg-[#1D1E22] p-6 rounded-lg shadow-lg">
          <div className="w-full bg-pink-500 h-16 rounded-t-lg flex justify-center items-center -mt-6 mb-4 relative">
            <img
              src={userDetailData?.profileImage?.url}
              alt="avatar"
              className="w-16 h-16 rounded-full border-4 border-white absolute -bottom-8"
            />
          </div>

          <h2 className="text-lg font-semibold mt-10">
            {userDetailData?.userDisplayName}
          </h2>

          <div className="w-full mt-6 flex gap-10">
            {/* Form Inputs */}
            <div className="flex-1 flex flex-col gap-3">
              <label>
                User name:
                <input
                  type="text"
                  className="w-full bg-gray-700 p-2 rounded"
                  value={userDetailData?.userDisplayName || ""}
                  readOnly
                />
              </label>
              <label>
                Email:
                <input
                  type="text"
                  className="w-full bg-gray-700 p-2 rounded"
                  value={userDetailData?.email || ""}
                  readOnly
                />
              </label>
              <label>
                Phone number:
                <input
                  type="text"
                  className="w-full bg-gray-700 p-2 rounded"
                  value={userDetailData?.phoneNumber || ""}
                  readOnly
                />
              </label>
              <label>
                Gender:
                <select
                  className="w-full bg-gray-700 p-2 rounded"
                  value={userDetailData?.gender || ""}
                  disabled
                >
                  <option value="">--</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                </select>
              </label>
              <label>
                Status:
                <input
                  type="text"
                  className="w-full bg-gray-700 p-2 rounded"
                  value={userDetailData?.bio || ""}
                  readOnly
                />
              </label>
              <button className="bg-pink-500 py-2 px-4 rounded mt-4 w-1/3">
                Update
              </button>
            </div>

            {/* Preview Card */}
            <div className="w-1/3 bg-gray-700 rounded-lg overflow-hidden">
              <div className="bg-pink-500 h-16 flex justify-center items-center">
                <img
                  src={userDetailData?.profileImage?.url}
                  alt="avatar"
                  className="w-12 h-12 rounded-full border-2 border-white"
                />
              </div>
              <div className="p-4">
                <div className="font-semibold">
                  {userDetailData?.userDisplayName}
                </div>
                <div className="text-sm text-green-400">Active</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;

// Use React's built-in useCallback
