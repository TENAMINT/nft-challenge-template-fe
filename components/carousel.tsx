/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/GL15OXrq7lE
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

/** Add fonts into your Next.js project:

import { Inter } from 'next/font/google'

inter({
  subsets: ['latin'],
  display: 'swap',
})

To read more about using these font, please visit the Next.js documentation:
- App Directory: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- Pages Directory: https://nextjs.org/docs/pages/building-your-application/optimizing/fonts
**/
import { CarouselItem, CarouselContent, CarouselPrevious, CarouselNext, Carousel } from "@/components/ui/carousel";
import { NFTContract } from "@/types/nft";

export function NFTCarousel(props: { nfts: ReadonlyArray<NFTContract> }) {
  return (
    <Carousel className="w-1/2 max-w-4xl">
      <CarouselContent>
        {props.nfts.map((nft) => (
          <CarouselItem key={nft.id}>
            <div className="p-4">
              <img
                alt="NFT"
                className="rounded-lg object-cover w-full"
                height="300"
                src={nft.icon}
                style={{
                  aspectRatio: "400/300",
                  objectFit: "cover",
                }}
                width="400"
              />
              <div className="mt-4 text-center">
                <h3 className="text-lg font-semibold">
                  <a href={`https://testnet.nearblocks.io/address/${nft.name}`} className="font-medium text-blue-500">
                    {nft.name}{" "}
                  </a>
                </h3>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/50 p-2 shadow-md transition-all hover:bg-white dark:bg-gray-950/50 dark:hover:bg-gray-950">
        <ChevronLeftIcon className="h-6 w-6" />
      </CarouselPrevious>
      <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/50 p-2 shadow-md transition-all hover:bg-white dark:bg-gray-950/50 dark:hover:bg-gray-950">
        <ChevronRightIcon className="h-6 w-6" />
      </CarouselNext>
    </Carousel>
  );
}

function ChevronLeftIcon(props: { className: string }) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon(props: { className: string }) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}