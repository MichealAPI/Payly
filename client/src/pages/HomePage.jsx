import Button from "../components/ui/Button/Button";
import { ArrowDownIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import HomeNavbar from "../components/ui/HomeNavbar/HomeNavbar";
import { useNavigate } from "react-router-dom";
import Logo from "../components/ui/Logo/Logo";
import Globe from "../components/ui/Globe/Globe";
import nfSampleOne from "../assets/nf-sample-1.png";
import nfSampleTwo from "../assets/nf-sample-2.png";
import LearnMoreContent from "../components/homepage/LearnMoreContent";

const HomePage = () => {
  const navigate = useNavigate();

  const dotsBackground = "dark:bg-[radial-gradient(circle_at_10px_10px,_rgba(255,255,255,0.15)_1px,_transparent_0)] bg-[length:30px_30px] bg-[radial-gradient(circle_at_10px_10px,_rgba(0,0,0,0.15)_1px,_transparent_0)] dark:bg-[length:30px_30px]";

  return (
    <>
    <div className={`flex flex-col min-h-[100vh] bg-primary ${dotsBackground}`}>
      <HomeNavbar />

      <main className="flex flex-1 justify-center  md:justify-between items-center md:p-20 p-5">
        <div className="flex flex-col gap-8 text-center md:text-left">
          <div className="flex flex-col gap-3 md:items-stretch items-center">
            <Logo />

            <h1 className="text-4xl md:text-5xl font-bold text-secondary m-0">
              Who said counting
              <br className="hidden md:block" /> expenses wasn't easy?
            </h1>

            <p className="text-lg text-secondary opacity-60">
              Discover our newest tracking features and simplify your expenses.
            </p>
          </div>

          <div className="flex w-full justify-center md:justify-start items-center flex-col sm:flex-row gap-4">
            <Button
              text="Sign Up"
              size="medium"
              textVisibility={true}
              onClick={() => navigate("/register")}
              style="fill"
              className="w-full sm:w-auto text-white"
            />

            <Button
              text="Learn More"
              size="medium"
              textVisibility={true}
              iconVisibility={true}
              icon={<ArrowRightIcon className="w-5" />}
              onClick={() => window.scrollTo({ top: document.getElementById("learn-more").offsetTop, behavior: 'smooth' })}
              style="outline"
              className="w-full sm:w-auto"
            />
          </div>
        </div>

  <div className="hidden md:flex relative flex-1 min-w-[35vw] max-w-[640px] aspect-square items-center justify-center reveal-up">
          {/* Soft glow behind the globe */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 rounded-full bg-gradient-to-tr from-cyan-400/20 via-fuchsia-500/15 to-amber-400/15 blur-3xl"
          />

          {/* Globe kept inside padding so floating cards have room around */}
          <div className="w-full h-full z-0">
            <Globe />
          </div>

          {/* Notifications pinned over the globe (top-left and bottom-right) */}
          <img
            src={nfSampleOne}
            alt=""
            aria-hidden="true"
            decoding="async"
            loading="eager"
            className="absolute z-20 md:bottom-[6%] md:right-[8%] lg:top-[28%] lg:left-[16%] md:w-[40%] lg:w-[40%] h-auto select-none pointer-events-none nf-float-2 drop-shadow-[0_10px_20px_rgba(0,0,0,0.35)]"
          />
          <img
            src={nfSampleTwo}
            alt=""
            aria-hidden="true"
            decoding="async"
            loading="eager"
            className="absolute z-20 md:bottom-[6%] md:right-[8%] lg:bottom-[28%] lg:right-[16%] md:w-[40%] lg:w-[40%] h-auto select-none pointer-events-none nf-float-2 drop-shadow-[0_10px_20px_rgba(0,0,0,0.35)]"
          />
        </div>
      </main>
    </div>

    <ArrowDownIcon className="absolute bottom-5 left-1/2 transform -translate-x-1/2 w-6 stroke-3 text-secondary/30 animate-bounce cursor-pointer" onClick={() => window.scrollTo({ top: document.getElementById("learn-more").offsetTop, behavior: 'smooth' })} />

    <LearnMoreContent/>

  </>
  );
};

export default HomePage;
