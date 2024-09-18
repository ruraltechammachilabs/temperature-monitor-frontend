import Lottie from "react-lottie";

export const LoadLottieAnimation = ({ animationData }) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div>
      <Lottie options={defaultOptions} width={80} height={80} />
    </div>
  )
};

export default LoadLottieAnimation;
