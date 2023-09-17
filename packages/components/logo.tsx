import React from "react";

import Icon, { type IconProps } from "@chakra-ui/icon";

export const Logo: React.FC<IconProps> = (props) => {
  return (
    <Icon
      viewBox="0 0 132 132"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <linearGradient
          id="gradient"
          x1="66"
          x2="66"
          y1="0"
          y2="132"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#1a5fff" offset="0" />
          <stop stop-color="#1a202c" offset="1" />
        </linearGradient>
      </defs>
      <path
        d="m66 6c-13.261 0-25.978 5.2678-35.355 14.645-9.3769 9.3768-14.645 22.094-14.645 35.355v60c0 3.573 1.906 6.874 5.0002 8.661 3.094 1.786 6.9059 1.786 9.9999 0 3.0942-1.787 5.0002-5.088 5.0002-8.661 1e-4 -3.572 1.9059-6.874 4.9997-8.66 3.094-1.786 6.9059-1.786 9.9999 0s5 5.087 5.0002 8.66c0 3.573 1.906 6.874 5.0002 8.661 3.094 1.786 6.9059 1.786 9.9999 0 3.094-1.787 4.9998-5.088 4.9997-8.661 2e-4 -3.573 1.9062-6.874 5.0002-8.66s6.9059-1.786 9.9999 0 5 5.087 5.0002 8.66c-1e-4 3.573 1.9057 6.874 4.9998 8.661 3.094 1.786 6.906 1.786 10 0 3.094-1.787 5-5.088 5-8.661v-60c0-13.261-5.268-25.978-14.645-35.355-9.3764-9.3769-22.094-14.645-35.355-14.645z"
        color="#000000"
        fill="#fff"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="m66 0c-30.856 0-55.998 25.144-55.998 56v60c-1e-4 5.707 3.0598 11.004 8.0021 13.858 4.9421 2.853 11.056 2.853 15.998 0 4.9423-2.853 8.0022-8.151 8.0021-13.858 1e-4 -1.438 0.7527-2.743 1.9978-3.463 1.2459-0.719 2.7544-0.719 4.0003 0s1.9997 2.024 1.9998 3.463c-1e-4 5.707 3.0598 11.004 8.0021 13.858 4.9421 2.853 11.058 2.853 16 0 4.9421-2.853 7.9981-8.151 7.9979-13.858 1e-4 -1.439 0.754-2.744 1.9999-3.463s2.7544-0.719 4.0003 0 1.9998 2.024 1.9999 3.463c-2e-4 5.707 3.0559 11.004 7.9979 13.858 4.9419 2.853 11.058 2.853 16 0s8-8.151 8-13.858v-60c0-30.856-25.142-55.999-55.998-56zm0 12h0.01c24.369 0 43.994 19.63 43.994 44v60c0 1.439-0.754 2.746-2 3.465-1.245 0.719-2.752 0.718-3.998 0-1.245-0.72-1.998-2.027-1.998-3.465 0-5.706-3.0599-11.002-8.002-13.856-4.942-2.8532-11.056-2.8532-15.998 0-4.942 2.853-8.0018 8.149-8.0021 13.856 1e-4 1.439-0.7539 2.745-1.9999 3.465-1.2455 0.718-2.7528 0.719-3.9982 0-1.246-0.719-2.0019-2.026-2.0019-3.465-2e-4 -5.706-3.0579-11.002-8-13.856-4.942-2.8532-11.058-2.8532-16 0-4.9417 2.853-7.9979 8.149-7.998 13.856 0 1.439-0.7538 2.746-1.9998 3.465-1.2459 0.719-2.7522 0.719-3.9982 0s-1.9999-2.026-1.9999-3.465v-60c0-24.37 19.625-43.997 43.994-44zm-20 32.199c-3.1296 0-6.1309 1.2432-8.3439 3.4561-2.2129 2.213-3.4561 5.2143-3.4561 8.3439s1.2432 6.1309 3.4561 8.3439c2.213 2.2129 5.2143 3.4561 8.3439 3.4561s6.1309-1.2432 8.3439-3.4561c2.2129-2.213 3.4561-5.2143 3.4561-8.3439s-1.2432-6.1309-3.4561-8.3439c-2.213-2.2129-5.2143-3.4561-8.3439-3.4561zm40 0c-3.1296 0-6.1309 1.2432-8.3439 3.4561-2.2129 2.213-3.4561 5.2143-3.4561 8.3439s1.2432 6.1309 3.4561 8.3439c2.213 2.2129 5.2143 3.4561 8.3439 3.4561s6.1309-1.2432 8.3439-3.4561c2.2129-2.213 3.4561-5.2143 3.4561-8.3439s-1.2432-6.1309-3.4561-8.3439c-2.213-2.2129-5.2143-3.4561-8.3439-3.4561z"
        color="#000000"
        fill="url(#gradient)"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Icon>
  );
};
