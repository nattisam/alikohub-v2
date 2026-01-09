import type { ReactNode } from 'react';

const Hero = ({style,children,className}:{style:React.CSSProperties; className:string;children:ReactNode}) => {
  return (
      <section className={className}
       style={style}
      >
      {children}
        <svg
          className="absolute bottom-0 w-full h-16 md:h-24 z-10"
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
        >
          <polygon
            points="0,20 300,70 1440,0 1440,100 0,100"
            className="fill-white"
          />
        </svg>
      </section>
  );
};

export default Hero;