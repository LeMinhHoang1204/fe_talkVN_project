import { IconProps } from "../../types/components.type";

export const CameraFillIcon = ({ className, ...props }: IconProps) => {
  return (
    <svg
      className={className}
      width="20"
      height="18"
      viewBox="0 0 20 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M10 13C11.6569 13 13 11.6569 13 10C13 8.34315 11.6569 7 10 7C8.34315 7 7 8.34315 7 10C7 11.6569 8.34315 13 10 13Z"
        fill="currentColor"
      />
      <path
        d="M18 2H14.83L13.59 0.65C13.22 0.24 12.68 0 12.12 0H7.88C7.32 0 6.78 0.24 6.4 0.65L5.17 2H2C0.9 2 0 2.9 0 4V16C0 17.1 0.9 18 2 18H18C19.1 18 20 17.1 20 16V4C20 2.9 19.1 2 18 2ZM10 15C7.24 15 5 12.76 5 10C5 7.24 7.24 5 10 5C12.76 5 15 7.24 15 10C15 12.76 12.76 15 10 15Z"
        fill="currentColor"
      />
    </svg>
  );
};
