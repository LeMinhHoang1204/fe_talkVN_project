import { useState } from "react";

function ChannelSideBar() {
    
    const groupName = "Group Name (\\:AwA:/)";
    const channels = [
        { category: "KÊNH THÔNG TIN", items: ["Kênh-mở-màn", "Nội-quy"] },
        { category: "KÊNH CHAT", items: ["Kênh-ăn", "Kênh-học", "Kênh-ngủ", "Kênh-nghỉ"] },
        { category: "KÊNH THOẠI", items: ["Thoại nội tại", "Thoại nội tâm"] },
    ];

    const [openStates, setOpenStates] = useState(
        channels.map(() => true) // mặc định tất cả mở
      );
    
      const toggleChannel = (index: number) => {
        const newStates = [...openStates];
        newStates[index] = !newStates[index];
        setOpenStates(newStates);
      };

    return (
        
        <div className="w-300px h-screen bg-[#2B2D31] flex flex-col">
        {/* Group Name */}
        <div className="w-full h-60px">
            <div
                className="flex justify-end items-start border-b-[2px] border-black/50"
                style={{
                    padding: "19px 0px",
                }}
            >
                <span className="font-bold text-white flex justify-center items-center w-full">{groupName}</span>
            </div>
        </div>

        {/* Search */}
        <div className="w-full h-auto">
            <div className="p-4 mt-[2px] mb-[2px] ml-[8px] mr-[2px] border-b border-[#F5F5F5]/40">
                <span className="flex items-center gap-2 bg-[#2B2D31]">
                    {/* Search Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path d="M19.25 19.25L15.2625 15.2625M17.4167 10.0833C17.4167 14.1334 14.1334 17.4167 10.0833 17.4167C6.03325 17.4167 2.75 14.1334 2.75 10.0833C2.75 6.03325 6.03325 2.75 10.0833 2.75C14.1334 2.75 17.4167 6.03325 17.4167 10.0833Z" stroke="#80848E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <input
                        type="text"
                        placeholder="Duyệt các kênh"
                        className="w-full h-auto bg-[#2B2D31] text-white placeholder-[#80848E]"
                    />
                </span>
            </div>
        </div>

        {/* Channel List */}
        <div className="flex-1 overflow-y-auto ">
            {channels.map((channel, index) => (
                <div key={index} className="mt-[20px] mb-[20px] ml-[14px] mr-[6px] ">
                    {/* Channel title */}
                    <span className="flex relative group items-center gap-2 p-[4px] text-[#80848E] stroke-[#80848E] cursor-pointer hover:bg-[#3A3C40] hover:text-[#DBDEE1] hover:stroke-[#DBDEE1] rounded-[4px] transition duration-200 ease-in-out"
                    onClick={() => toggleChannel(index)}
                    >
                        {/* Chevron icon */}
                        {openStates[index] ? (
                        // Chevron Down
                        <svg className="group-hover:stroke-[#80848E]" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none"                        >
                            <path d="M5.5 8.25L11 13.75L16.5 8.25" stroke="#currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        ) : (
                        // Chevron Right
                        <svg className="group-hover:stroke-[#80848E]" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                            <path d="M8.25 5.5L13.75 11L8.25 16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        )}
                        <span className="font-bold" style={{ fontSize: "16px", fontWeight: 600 }}>
                            {channel.category}
                        </span>
                        {/* Add channel icon */}
                        <span className="ml-auto mr-4 relative group/icon flex items-center opacity-0 group-hover:opacity-100 ">
                            <svg className="" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                                <path d="M11 4.58333V17.4167M4.58334 11H17.4167" stroke="#F5F5F5" stroke-opacity="0.4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 border border-[#B5BAC1] mt-1 mb-1 px-2 py-1 bg-[#2C2C2C] text-[#F5F5F5] text-xs rounded shadow-lg whitespace-nowrap z-10 hidden group-hover/icon:block" style={{ fontSize: "11px"}}>
                        Thêm kênh
                        </div>
                        </span>
                    </span>
                    
                    {/* Channel items */}
                    {openStates[index] && (
                    <ul className="mt-2">
                        {channel.items.map((item, index) => (
                            <li
                                key={index}
                                className="text-[#80848E] group flex items-center relative mt-2 ml-[10px] p-[2px] cursor-pointer hover:bg-[#3A3C40] hover:text-[#DBDEE1] rounded-[4px] transition duration-200 ease-in-out"
                                style={{
                                    fontSize: "16px",
                                    fontWeight: 600,
                                }}
                            >   
                                {/* Icon # */}
                                <svg className="mr-2 group-hover:stroke-[#80848E]" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 22 22" fill="none">
                                    <path d="M3.66667 8.25H18.3333M3.66667 13.75H18.3333M9.16667 2.75L7.33333 19.25M14.6667 2.75L12.8333 19.25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                {item}

                                {/* Icon hover */}
                                <span className="absolute right-0 flex items-center mr-4 gap-1 opacity-0 group-hover:opacity-100">
                                    {/* Add user icon */}
                                    <span className="relative group/icon flex items-center">
                                    <svg className="" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 22 22" fill="none">
                                    <g clip-path="url(#clip0_153_103)">
                                        <path d="M14.6667 19.25V17.4167C14.6667 16.4442 14.2804 15.5116 13.5927 14.8239C12.9051 14.1363 11.9725 13.75 11 13.75H4.58335C3.61089 13.75 2.67826 14.1363 1.99063 14.8239C1.303 15.5116 0.916687 16.4442 0.916687 17.4167V19.25M18.3334 7.33333V12.8333M21.0834 10.0833H15.5834M11.4584 6.41667C11.4584 8.44171 9.81673 10.0833 7.79169 10.0833C5.76664 10.0833 4.12502 8.44171 4.12502 6.41667C4.12502 4.39162 5.76664 2.75 7.79169 2.75C9.81673 2.75 11.4584 4.39162 11.4584 6.41667Z" stroke="#DBDEE1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_153_103">
                                        <rect width="20" height="20" fill="white"/>
                                        </clipPath>
                                    </defs>
                                    </svg>
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 border border-[#B5BAC1] mt-1 mb-1 px-2 py-1 bg-[#2C2C2C] text-[#F5F5F5] text-xs rounded shadow-lg whitespace-nowrap z-10 hidden group-hover/icon:block" style={{ fontSize: "11px"}}>
                                    Thêm thành viên
                                    </div>
                                    </span>

                                    {/* Setting icon */}
                                    <span className="relative group/icon flex items-center">
                                    <svg className="" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 22 22" fill="none">
                                    <g clip-path="url(#clip0_146_559)">
                                        <path d="M11.1629 13.5958C12.6646 13.5958 13.882 12.3784 13.882 10.8766C13.882 9.37488 12.6646 8.15748 11.1629 8.15748C9.66112 8.15748 8.44372 9.37488 8.44372 10.8766C8.44372 12.3784 9.66112 13.5958 11.1629 13.5958Z" stroke="#DBDEE1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M17.8701 13.5958C17.7495 13.8692 17.7135 14.1724 17.7668 14.4665C17.8201 14.7605 17.9603 15.0318 18.1692 15.2454L18.2236 15.2998C18.3922 15.4682 18.5259 15.6681 18.6171 15.8882C18.7083 16.1082 18.7553 16.3441 18.7553 16.5823C18.7553 16.8206 18.7083 17.0564 18.6171 17.2765C18.5259 17.4966 18.3922 17.6965 18.2236 17.8649C18.0553 18.0334 17.8553 18.1671 17.6353 18.2583C17.4152 18.3496 17.1793 18.3965 16.9411 18.3965C16.7029 18.3965 16.467 18.3496 16.2469 18.2583C16.0268 18.1671 15.8269 18.0334 15.6585 17.8649L15.6042 17.8105C15.3905 17.6015 15.1192 17.4614 14.8252 17.408C14.5312 17.3547 14.2279 17.3907 13.9545 17.5114C13.6865 17.6263 13.4578 17.8171 13.2968 18.0602C13.1357 18.3034 13.0493 18.5884 13.0482 18.88V19.0341C13.0482 19.5149 12.8572 19.976 12.5172 20.3159C12.1772 20.6559 11.7162 20.8469 11.2354 20.8469C10.7546 20.8469 10.2935 20.6559 9.95356 20.3159C9.6136 19.976 9.42261 19.5149 9.42261 19.0341V18.9525C9.41559 18.6525 9.31848 18.3616 9.14391 18.1175C8.96933 17.8734 8.72536 17.6875 8.44372 17.5839C8.17033 17.4632 7.86708 17.4272 7.57305 17.4806C7.27902 17.5339 7.00771 17.674 6.79409 17.883L6.73971 17.9374C6.57135 18.1059 6.37142 18.2396 6.15136 18.3309C5.93129 18.4221 5.6954 18.469 5.45717 18.469C5.21895 18.469 4.98306 18.4221 4.76299 18.3309C4.54292 18.2396 4.34299 18.1059 4.17464 17.9374C4.00609 17.769 3.87238 17.5691 3.78116 17.349C3.68993 17.129 3.64298 16.8931 3.64298 16.6548C3.64298 16.4166 3.68993 16.1807 3.78116 15.9607C3.87238 15.7406 4.00609 15.5407 4.17464 15.3723L4.22902 15.3179C4.43798 15.1043 4.57815 14.833 4.63146 14.539C4.68477 14.2449 4.64878 13.9417 4.52813 13.6683C4.41323 13.4002 4.22245 13.1716 3.97928 13.0105C3.7361 12.8495 3.45115 12.7631 3.15948 12.7619H3.0054C2.52462 12.7619 2.06354 12.5709 1.72358 12.231C1.38361 11.891 1.19263 11.4299 1.19263 10.9491C1.19263 10.4684 1.38361 10.0073 1.72358 9.66732C2.06354 9.32736 2.52462 9.13637 3.0054 9.13637H3.08697C3.38698 9.12935 3.67794 9.03225 3.92203 8.85767C4.16611 8.68309 4.35203 8.43912 4.45562 8.15748C4.57627 7.88409 4.61226 7.58084 4.55895 7.28681C4.50564 6.99278 4.36546 6.72147 4.15651 6.50785L4.10213 6.45347C3.93358 6.28511 3.79987 6.08518 3.70865 5.86512C3.61742 5.64505 3.57046 5.40916 3.57046 5.17093C3.57046 4.93271 3.61742 4.69682 3.70865 4.47675C3.79987 4.25668 3.93358 4.05676 4.10213 3.8884C4.27048 3.71985 4.47041 3.58614 4.69048 3.49492C4.91055 3.40369 5.14644 3.35674 5.38466 3.35674C5.62289 3.35674 5.85878 3.40369 6.07885 3.49492C6.29891 3.58614 6.49884 3.71985 6.6672 3.8884L6.72158 3.94278C6.9352 4.15174 7.20651 4.29191 7.50054 4.34522C7.79457 4.39853 8.09782 4.36254 8.3712 4.24189H8.44372C8.7118 4.12699 8.94043 3.93621 9.10147 3.69304C9.26252 3.44987 9.34894 3.16491 9.3501 2.87325V2.71916C9.3501 2.23838 9.54109 1.7773 9.88105 1.43734C10.221 1.09738 10.6821 0.906387 11.1629 0.906387C11.6437 0.906387 12.1047 1.09738 12.4447 1.43734C12.7847 1.7773 12.9756 2.23838 12.9756 2.71916V2.80073C12.9768 3.0924 13.0632 3.37735 13.2243 3.62053C13.3853 3.8637 13.614 4.05448 13.882 4.16938C14.1554 4.29003 14.4587 4.32602 14.7527 4.27271C15.0467 4.2194 15.318 4.07922 15.5317 3.87027L15.586 3.81589C15.7544 3.64734 15.9543 3.51363 16.1744 3.42241C16.3945 3.33118 16.6303 3.28422 16.8686 3.28422C17.1068 3.28422 17.3427 3.33118 17.5628 3.42241C17.7828 3.51363 17.9828 3.64734 18.1511 3.81589C18.3197 3.98424 18.4534 4.18417 18.5446 4.40424C18.6358 4.62431 18.6828 4.8602 18.6828 5.09842C18.6828 5.33665 18.6358 5.57254 18.5446 5.79261C18.4534 6.01267 18.3197 6.2126 18.1511 6.38096L18.0967 6.43534C17.8878 6.64896 17.7476 6.92027 17.6943 7.2143C17.641 7.50833 17.677 7.81158 17.7976 8.08496V8.15748C17.9125 8.42556 18.1033 8.65419 18.3465 8.81523C18.5896 8.97628 18.8746 9.0627 19.1663 9.06386H19.3203C19.8011 9.06386 20.2622 9.25485 20.6022 9.59481C20.9421 9.93477 21.1331 10.3959 21.1331 10.8766C21.1331 11.3574 20.9421 11.8185 20.6022 12.1585C20.2622 12.4984 19.8011 12.6894 19.3203 12.6894H19.2388C18.9471 12.6906 18.6622 12.777 18.419 12.938C18.1758 13.0991 17.985 13.3277 17.8701 13.5958Z" stroke="#DBDEE1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_146_559">
                                        <rect width="21.7533" height="21.7533" fill="white" transform="translate(0.286255)"/>
                                        </clipPath>
                                    </defs>
                                    </svg>

                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 border border-[#B5BAC1] mt-1 mb-1 px-2 py-1 bg-[#2C2C2C] text-[#F5F5F5] text-xs rounded shadow-lg whitespace-nowrap z-10 hidden group-hover/icon:block" style={{ fontSize: "11px"}}>
                                    Cài đặt
                                    </div>
                                    </span>
                                </span>
                            </li>
                        ))}
                    </ul>
                    )}
                </div>
            ))}
        </div>
        </div>
    );
}

export default ChannelSideBar;