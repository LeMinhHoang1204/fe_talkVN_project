import { useParams } from "react-router-dom";
import { useGetGroupByInvitationCodeQuery } from "../../data/group/group.api";

function InvitationPage() {
  const { invitationCode } = useParams<{ invitationCode: string }>();
  const { data, isLoading, error } = useGetGroupByInvitationCodeQuery({ invitationCode: invitationCode! });

  if (isLoading) return <div>Loading invitation...</div>;
  if (error) return <div>Error loading invitation.</div>;
  if (!data?.result) return <div>No invitation found.</div>;

  const group = data.result;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <div className="flex flex-col items-center">
          <img
            src={group.avatar || "/default-group-avatar.png"}
            alt={group.name}
            className="w-24 h-24 rounded-full mb-4 border"
          />
          <h1 className="text-2xl font-bold mb-2">{group.name}</h1>
          <span className="text-sm text-gray-500 mb-2">
            {group.isPrivate ? "🔒 Private Group" : "🌐 Public Group"}
          </span>
          <p className="mb-2 text-gray-700">{group.description}</p>
          <div className="mb-2 text-gray-700">
            <b>Status:</b> {group.status}
          </div>
          <div className="mb-2 text-gray-700">
            <b>Max Members:</b> {group.maxQuantity}
          </div>
          <div className="mb-2 text-gray-700">
            <b>Created On:</b> {new Date(group.createdOn).toLocaleString()}
          </div>
          <div className="mb-2 text-gray-700">
            <b>Updated On:</b> {new Date(group.updatedOn).toLocaleString()}
          </div>
          <div className="mb-2 flex items-center gap-2">
            <img
              src={group.creator.avatarUrl || "/default-avatar.png"}
              alt={group.creator.displayName}
              className="w-8 h-8 rounded-full"
            />
            <span className="text-gray-700">
              <b>Creator:</b> {group.creator.displayName}
            </span>
          </div>
          <a
            href={group.url}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            target="_blank"
            rel="noopener noreferrer"
          >
            Tham gia nhóm
          </a>
        </div>
      </div>
    </div>
  );
}

export default InvitationPage;