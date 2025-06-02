export default function WelcomePage() {
  return (
    <div
      className="flex items-center justify-center color-[#313338] text-white"
      style={{
        width: "700px",
        height: "499px",
        flexShrink: 0,
        margin: "0 auto",
        top: "60px",
        marginRight: "240px",
        background: "#313338",
      }}
    >
      <div className="text-center">
        <img
          src="public\welcome.png"
          alt="Welcome Bot"
          className="w-[450px] mb-4 opacity-80 mx-auto"
        />
        <p className="text-lg italic ">~Wellcome to TalkVN~</p>
      </div>
    </div>
  );
}
