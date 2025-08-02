import Image from "next/image";


export default function Ellipses() {
  return (
    <div className="flex flex-col gap-5 absolute left-[68.5%] top-[5%] 2xl:left-[68.5%] 2xl:top-[20%]">
        <div className="relative h-[100px] w-[100px] rounded-full">
          <Image src="/images/ellipse1.png" alt="ellipses" fill objectFit="contain" />
        </div>
        <div className="relative h-[100px] w-[100px] rounded-full">
          <Image src="/images/ellipse2.png" alt="ellipses" fill objectFit="contain" />
        </div>
        <div className="relative h-[100px] w-[100px] rounded-full">
          <Image src="/images/ellipse3.png" alt="ellipses" fill objectFit="contain" />
        </div>
    </div>
  );
}
