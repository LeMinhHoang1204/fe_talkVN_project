const Home = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden ">
      <video
        className="w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/video/backgroud_home.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className=" inset-0 flex items-center justify-center px-4 z-10">
        <div className="bg-black bg-opacity-65 rounded-[40px] p-5 text-white text-center shadow-lg">
          <h1 className="text-5xl font-bold mb-4">TalkVN</h1>
          <p className="text-xl">Fun group chat and meeting</p>
        </div>
      </div>

      {/* Navbar */}
      <div className="absolute top-0   left-0 w-full flex items-center justify-between p-3 z-10">
        <div className="flex items-center gap-2">
          <button className="group">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="70"
              height="70"
              viewBox="0 0 52 49"
              fill="none"
            >
              {/* <path d="M0.406791 24.1035C0.182126 10.7915 10.793 0 24.1069 0H26.0999C39.4137 0 50.3889 10.7915 50.6136 24.1035C50.8382 37.4155 40.2273 48.207 26.9135 48.207H24.9205C11.6066 48.207 0.631455 37.4155 0.406791 24.1035Z" fill="#2C2636" /> */}
              <path
                d="M34.3642 16.1581C33.4741 16.3702 31.7354 17.4693 30.2513 18.7805C29.0639 19.8218 28.7365 20.0532 28.1969 20.2074C27.5873 20.381 22.4749 20.3039 22.1102 20.111C21.9582 20.0339 21.3886 19.6 20.8488 19.1469C18.5778 17.2668 16.7116 16.1677 15.7676 16.1581C14.8237 16.1581 14.5286 17.7103 14.6443 22.1839C14.7172 24.7196 14.7007 24.9317 14.502 25.6548C14.3699 26.1562 14.281 26.8407 14.2537 27.6024C14.2347 28.258 14.1934 28.7883 14.1733 28.7883C14.1432 28.7883 13.8104 28.7015 13.4369 28.5858C12.3472 28.2773 12.2792 28.4123 13.3298 28.7883C14.0572 29.0486 14.2903 29.1739 14.3737 29.3571C14.426 29.4825 14.4285 29.6271 14.3889 29.6657C14.3494 29.7042 14.0179 29.6946 13.6556 29.6464C13.0517 29.5596 12.7807 29.5692 12.02 29.7139C11.4796 29.8199 11.7724 29.9163 12.4945 29.8681C12.9059 29.8488 13.5387 29.8585 13.9008 29.897C14.5545 29.9549 14.5547 29.9645 14.6305 30.2923C14.6637 30.4755 14.6767 30.6491 14.647 30.678C14.6174 30.7069 14.2975 30.7937 13.9375 30.8805C13.5773 30.9576 13.2779 31.0637 13.2787 31.1119C13.2795 31.1601 13.3802 31.1793 13.5103 31.1504C14.2405 30.9865 14.6409 30.9094 14.7513 30.9094C14.8216 30.9094 14.9755 31.1022 15.1001 31.3433C15.2246 31.5843 15.4606 31.8832 15.6236 32.0182L15.9188 32.2592H25.5585C30.8602 32.2495 35.2978 32.211 35.4276 32.1628C35.5673 32.1146 35.7835 31.835 35.9879 31.4493C36.1728 31.1022 36.3688 30.813 36.419 30.813C36.4794 30.8226 36.8218 30.8805 37.2045 30.948C38.0002 31.0926 38.1189 30.9865 37.3528 30.813C36.5062 30.6298 36.4659 30.6201 36.463 30.4466C36.4662 30.0417 36.5959 29.9935 38.031 29.9453C39.3055 29.897 39.3955 29.8778 39.1124 29.7621C38.9201 29.6753 38.4373 29.6271 37.7746 29.6271L36.7405 29.6367L36.7654 29.3282C36.7904 29.0197 36.8302 29.0004 38.6868 28.3448C38.8465 28.2869 38.8161 28.2676 38.5244 28.2387C38.3132 28.2194 37.8926 28.2869 37.553 28.393C37.2135 28.5087 36.9238 28.5955 36.9037 28.5955C36.8836 28.5955 36.8248 28.0845 36.7841 27.4578C36.7302 26.6479 36.6303 26.0791 36.4291 25.462C36.1325 24.5461 36.1451 24.7003 36.2717 22.0875C36.3099 21.3741 36.0915 18.5491 35.9366 17.7007C35.7825 16.9004 35.4914 16.3123 35.1578 16.1773C34.8745 16.052 34.8042 16.052 34.3642 16.1581ZM21.3235 23.4759C22.5481 24.0447 23.5141 25.3559 23.6253 26.59C23.6749 27.1492 23.6475 27.3132 23.434 27.747C23.0942 28.4412 22.4714 29.0197 21.6945 29.3957C21.0569 29.6946 21.9968 29.7042 19.7316 29.7042C18.2254 29.7042 17.8116 29.5789 16.9962 28.8654C16.2217 28.1905 15.9246 27.2457 16.1168 26.1369C16.5289 23.7844 19.1373 22.4539 21.3235 23.4759ZM32.1343 23.2541C33.2542 23.5723 34.0482 24.2086 34.5571 25.2113C34.7961 25.6838 34.8294 25.8766 34.8436 26.7154C34.8573 27.5253 34.8209 27.747 34.6456 28.0748C34.3242 28.6629 33.8591 29.0679 33.1318 29.4053C32.5139 29.6849 32.4239 29.7042 31.2792 29.7042C30.2648 29.6946 29.9832 29.6657 29.4979 29.4728C28.7401 29.1932 27.8841 28.4508 27.5211 27.7663C27.2825 27.3132 27.2498 27.1589 27.2808 26.619C27.3866 25.1535 28.5076 23.7458 29.9951 23.2348C30.5043 23.0613 31.4785 23.0709 32.1343 23.2541ZM26.1834 28.8268C26.3472 29.01 26.1616 29.3186 25.763 29.5017C25.4343 29.656 25.2529 29.6174 24.9268 29.3378C24.6722 29.1257 24.6171 28.8365 24.8167 28.7594C25.0959 28.6437 26.0707 28.6919 26.1834 28.8268Z"
                fill="white"
              />
            </svg>
          </button>
          <div className="text-white font-bold text-xl">TalkVN</div>
        </div>
        <div className="space-x-6 text-white">
          <a href="#">Solutions</a>
          <a href="#">Community</a>
          <a href="#">Resources</a>
          <a href="#">Pricing</a>
          <a href="#">Contact</a>
        </div>
        <div className="space-x-2">
          <button className="bg-white text-black px-4 py-1 rounded">
            Sign in
          </button>
          <button className="bg-purple-800 text-white px-4 py-1 rounded">
            Register
          </button>
        </div>
      </div>

      {/* <div className="w-full h-32" /> */}

      <div
        className="relative w-full min-h-screen py-10 px-4 text-white"
        style={{
          background:
            "url('/background_home.jpg') lightgray 7px -0.056px / 99.519% 108.642% no-repeat",
          aspectRatio: "97 / 158",
          opacity: 0.95,
        }}
      >
        <div className="absolute inset-0 bg-[#3F2B6A] opacity-100 -z-10"></div>

        <div className="max-w-5xl mx-auto flex flex-col gap-12 relative">
          {/* Khung 1 */}
          <div className="flex flex-col md:flex-row items-center gap-6 bg-gray-100 bg-opacity-60 p-8 rounded-[40px] shadow-lg">
            <div className="rounded-[30px] overflow-hidden shadow-lg w-full md:w-1/2">
              <video className="w-full h-auto" autoPlay loop muted playsInline>
                <source src="/video/shortvideo1.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="text-gray-800 text-center md:text-left md:w-1/2">
              <h2 className="text-2xl font-bold mb-2">
                There is always something to do together
              </h2>
              <p className="text-sm">
                Watch videos, drop funny memes. Text, call, video chat
                seamlessly, all in one group chat.
              </p>
            </div>
          </div>

          {/* Khung 2 */}
          <div className="flex flex-col md:flex-row items-center gap-6 bg-gray-100 bg-opacity-60 p-8 rounded-[40px] shadow-lg">
            <div className="rounded-[30px] overflow-hidden shadow-lg w-full md:w-1/2">
              <video className="w-full h-auto" autoPlay loop muted playsInline>
                <source src="/video/shortvideo2.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="text-gray-800 text-center md:text-left md:w-1/2">
              <h2 className="text-2xl font-bold mb-2">
                Meet when you're free, no phone calls required
              </h2>
              <p className="text-sm">
                Send a jump-in short vid or text chats without having to call or
                free up anyone.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
