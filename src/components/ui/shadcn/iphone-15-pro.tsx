import { cn } from '@/lib/utils';
import { SVGProps, ReactNode } from 'react';

export interface Iphone15ProProps extends SVGProps<SVGSVGElement> {
  src?: string;
  videoSrc?: string;
  children?: ReactNode;
}

export default function Iphone15Pro({
  src,
  videoSrc,
  children,
  className,
  ...props
}: Iphone15ProProps) {
  return (
    <svg
      className={cn('size-full', className)}
      viewBox="0 0 433 882"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Frame */}
      <path
        d="M2 73C2 32.6832 34.6832 0 75 0H358C398.317 0 431 32.6832 431 73V809C431 849.317 398.317 882 358 882H75C34.6832 882 2 849.317 2 809V73Z"
        className="fill-[#E5E5E5] dark:fill-[#404040]"
      />

      {/* Screen bezel */}
      <path
        d="M6 74C6 35.3401 37.3401 4 76 4H357C395.66 4 427 35.3401 427 74V808C427 846.66 395.66 878 357 878H76C37.3401 878 6 846.66 6 808V74Z"
        className="fill-[#262626] dark:fill-[#262626]"
      />

      {/* Screen area */}
      <path
        d="M21 83C21 44.3401 52.3401 13 91 13H342C380.66 13 412 44.3401 412 83V799C412 837.66 380.66 869 342 869H91C52.3401 869 21 837.66 21 799V83Z"
        className="fill-[#F5F5F5] dark:fill-[#171717]"
      />

      {/* Dynamic Island */}
      <path
        d="M154 29C154 24.5817 157.582 21 162 21H271C275.418 21 279 24.5817 279 29V29C279 33.4183 275.418 37 271 37H162C157.582 37 154 33.4183 154 29V29Z"
        className="fill-[#262626] dark:fill-[#171717]"
      />

      {/* Side buttons */}
      <path
        d="M0 171C0 167.686 2.68629 165 6 165V165C9.31371 165 12 167.686 12 171V213C12 216.314 9.31371 219 6 219V219C2.68629 219 0 216.314 0 213V171Z"
        className="fill-[#E5E5E5] dark:fill-[#404040]"
      />
      <path
        d="M0 286C0 282.686 2.68629 280 6 280V280C9.31371 280 12 282.686 12 286V346C12 349.314 9.31371 352 6 352V352C2.68629 352 0 349.314 0 346V286Z"
        className="fill-[#E5E5E5] dark:fill-[#404040]"
      />
      <path
        d="M0 363C0 359.686 2.68629 357 6 357V357C9.31371 357 12 359.686 12 363V423C12 426.314 9.31371 429 6 429V429C2.68629 429 0 426.314 0 423V363Z"
        className="fill-[#E5E5E5] dark:fill-[#404040]"
      />
      <path
        d="M421 234C421 230.686 423.686 228 427 228V228C430.314 228 433 230.686 433 234V334C433 337.314 430.314 340 427 340V340C423.686 340 421 337.314 421 334V234Z"
        className="fill-[#E5E5E5] dark:fill-[#404040]"
      />

      {/* Screen content */}
      <foreignObject
        x="21"
        y="13"
        width="391"
        height="856"
        clipPath="url(#roundedScreen)"
      >
        <div className="size-full overflow-hidden rounded-[54px] bg-white dark:bg-neutral-900">
          {src && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt="Screen content"
              className="size-full object-cover object-top"
            />
          )}
          {videoSrc && (
            <video
              src={videoSrc}
              autoPlay
              loop
              muted
              playsInline
              className="size-full object-cover object-top"
            />
          )}
          {children}
        </div>
      </foreignObject>

      <defs>
        <clipPath id="roundedScreen">
          <rect x="21" y="13" width="391" height="856" rx="70" ry="70" />
        </clipPath>
      </defs>
    </svg>
  );
}
