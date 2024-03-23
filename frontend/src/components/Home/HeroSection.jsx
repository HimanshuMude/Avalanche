import React from "react";
import classes from "./HeroSection.module.css";
import heroImage from "../../assets/Bhavik.png";
import TypeIt from "typeit-react";
import { TypeAnimation } from 'react-type-animation';
import { useState } from "react";

const HeroSectionComponent = (props) => {
  const [textColor, setTextColor] = useState('red');
  const CURSOR_CLASS_NAME = 'custom-type-animation-cursor';
  const [typingStatus, setTypingStatus] = useState('Initializing');

  return (
    <div className={classes.hero} id={props.id}>
      <div className={classes["hero-container"]}>
        <div className={classes.texts}>

          <div className={classes["gradient-span"]}
            style={{
              fontSize: '40px',
            }}
          >
            <TypeAnimation
              sequence={[
                'Join the AI Revolution with',
                800,
                () => setTextColor('red'),
                'StreamSight',
                800,
                () => setTextColor('aqua'),
              ]}
              repeat={Infinity}
            />
          </div>

          <p>
            Discover the smarter way to explore Youtube videos with our advance transcription technology. You can teach and learn from your own bot and get instant answer to your video queries. Plus we are always working on new updates and features to make your video exploration even better. Stay tuned!
          </p>
          {/* <button className={classes.buttons}>Try Now</button> */}
        </div>
        <div className={classes["image-container"]}>
          <img src={heroImage} alt="" height="500px"/>
        </div>

      </div>

    </div>
  );
};

export default HeroSectionComponent;
