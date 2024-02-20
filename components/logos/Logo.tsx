import * as React from 'react';
import { Box } from '@chakra-ui/react';
function Logo() {
  return (
    <Box width={'38px'} height={'30px'}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1348 1088" width={38} height={30}>
        <defs>
          <linearGradient
            id="a"
            x2={1}
            gradientUnits="userSpaceOnUse"
            gradientTransform="matrix(568.162 818.724 -417.707 289.872 874.01 -309.411)">
            <stop offset={0} stopColor="#1fb573" />
            <stop offset={1} stopColor="#007675" />
          </linearGradient>
          <linearGradient
            id="b"
            x2={1}
            gradientUnits="userSpaceOnUse"
            gradientTransform="matrix(532.894 -837.06 416.487 265.147 -65.582 502.748)">
            <stop offset={0} stopColor="#137487" />
            <stop offset={1} stopColor="#00a8b4" />
          </linearGradient>
        </defs>
        <path
          fillRule="evenodd"
          d="M905.2 910.1l-6.9 10.7c-50 77.3-133.4 120.3-219.3 122.4H667.6c-85.8-2.1-169.2-45.1-219.3-122.4l-6.8-10.6-292.1-451.5c-83.5-129-41.7-303.6 94.5-379.9C368 9.2 525.2 51.9 602.5 171.3l70.8 109.5 60.1 92.9 165.4 255.6c12.4 19.2 22.1 39.4 29 60.2 24.9 73.9 15.8 154.6-22.6 220.6zm-91.1-226L673.3 466.5l-60.1-92.8-98-151.6c-52.5-81.1-163.7-101.7-242-42.2-68 51.6-83.6 155.2-37.2 226.9l182.8 282.6L527 856.7c12.9 23.1 31.4 43.5 55.2 58.9 29.3 19 62.5 27.6 95.1 26.7 30-.6 60.2-9.2 87.2-26.7 23.8-15.4 42.4-35.9 55.3-59.2 29-52.3 29-118.6-5.7-172.3z"
          fill="url(#a)"
        />
        <path
          d="M1117.8 87.8c-124.3-80.4-290.7-44.7-371 79.5l-73.5 113.5 60.1 92.9 98.1-151.6c50.1-77.5 154-99.8 231.5-49.7 77.5 50.2 99.7 154.1 49.6 231.6L927.8 689.5l-108 166.9c-12.9 23.3-31.5 43.8-55.3 59.2-27 17.5-57.2 26.1-87.2 26.7-32.6.9-65.8-7.7-95.1-26.7-23.8-15.4-42.3-35.8-55.2-58.9-29.1-52.4-29.2-118.8 5.6-172.6l140.7-217.6-60.1-92.8-165.4 255.6c-12.4 19.2-22 39.4-29 60.1-24.9 74-15.7 154.7 22.7 220.8l6.8 10.6c50.1 77.3 133.5 120.3 219.3 122.4H679c85.9-2.1 169.3-45.1 219.3-122.4l6.9-10.7 292.1-451.3c80.3-124.3 44.7-290.7-79.5-371z"
          fill="url(#b)"
        />
      </svg>
    </Box>
  );
}

export default Logo;
