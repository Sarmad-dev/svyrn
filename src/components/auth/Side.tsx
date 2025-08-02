import Image from "next/image";
import { Separator } from "../ui/separator";

export default function Side() {
  return (

          <div className="">
            <div>
              <Image src="/icons/logo-gray.png" alt="logo" width={250} height={170} />
            </div>
            <div className="2xl:mt-16 mt-5">
            <h1 className="font-bold text-2xl xxl text-primary">
              The social network for sovereign beings
            </h1>
            <Separator className="data-[orientation=horizontal]:h-[2px] my-2 bg-primary" />
            <div className="font-bold text-2xl text-primary">
              <h2>Break free from the algorithm.</h2>
              <h2>Speak freely</h2>
              <h2>Connect consciously.</h2>
            </div>
            </div>
            
            <div className="text-[#00000099] my-10 font-medium text-2xl">
              SVRYN is not just another platform - it&apos;s a movement. A
              censorship-resistant space where truth-seekers, healers,
              creatives, and sovereign thinkers gather without fear of
              shadowbans, suppression, or manipulation.
            </div>
              <h4 className="2xl:my-7 my-1 font-semibold text-[#00000099] text-2xl">Why SVRYN</h4>
              <div className="flex flex-col 2xl:gap-3 gap-1 text-[#00000099] font-medium 2xl:text-2xl text-xl">
                <p>
                  ✦{" "}
                  <span className="text-gray-800">
                    Unfiltered Expression – Speak your truth without censorship.
                  </span>
                </p>
                <p>
                  ✦{" "}
                  <span className="text-gray-800">
                    Interest-Led Feeds – Your experience is shaped by your vibe,
                    not algorithms.
                  </span>
                </p>
                <p>
                  ✦{" "}
                  <span className="text-gray-800">
                    Hosted for Freedom – Our servers honour your rights and
                    privacy.
                  </span>
                </p>
                <p>
                  ✦{" "}
                  <span className="text-gray-800">
                    Built to Unite – Created for conscious connection, not
                    division.
                  </span>
                </p>
                <p>
                  ✦{" "}
                  <span className="text-gray-800">
                    Multi-Realm – Media, marketplace, groups, pages, soul-aligned
                    commerce.
                  </span>
                </p>
              </div>

            <div className="text-center text-primary mt-5 font-bold 2xl:text-2xl text-xl">
              This is where the new world begins.
              <br />
              Not a matrix. A mirror.
              <br />
              For those who came to awaken.
            </div>
          </div>

  );
}
