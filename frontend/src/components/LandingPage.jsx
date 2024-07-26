// src/components/LandingPage.jsx

// import video file
import landingPageVideo from "../media/landing-page.mp4";
// import captions file
import captionsFile from "../media/captions.vtt";
// import stylesheet

const LandingPage = () => {
  /* style for landing page container */
  const landingPageStyle = {
    position: "relative",
    height: "100vh",
    width: "100vw",
    overflow: "hidden",
    padding: "0",
    margin: "0",
    /* flexbox to centre content */
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  /* style for video element */
  const videoStyle = {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    objectFit: "cover",
    /* ensure the video is behind other content */
    zIndex: "-1",
  };

  /* style for content over video */
  const contentStyle = {
    position: "relative",
    /* ensure content is above the video */
    zIndex: "1",
    textAlign: "center",
    color: "white",
  };

  // render the landing page
  return (
    <div style={landingPageStyle}>
      <div style={contentStyle}>
        <h3>Credential Manager</h3>
      </div>
      <video
        autoPlay
        muted
        loop
        style={videoStyle}
        aria-label="Close-up view of a man doing computer programming"
      >
        <source src={landingPageVideo} type="video/mp4" />
        <track
          kind="subtitles"
          src={captionsFile}
          srcLang="en"
          label="English"
        />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

// export page
export default LandingPage;
