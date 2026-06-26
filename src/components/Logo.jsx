const Logo = ({ className = 'h-10 max-w-[200px]' }) => (
  <img
    src="/startup-labs-logo.png"
    alt="StartUP LAbs"
    className={`${className} w-auto object-contain`}
  />
);

export default Logo;
