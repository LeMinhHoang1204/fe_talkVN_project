export default function WelcomePage() {
  return (
    <div
      className="flex items-center justify-center color-[#313338] text-white"
      style={{
        width: "100vw",
        height: "100vh",
        flexShrink: 0,
        top: "60px",
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
