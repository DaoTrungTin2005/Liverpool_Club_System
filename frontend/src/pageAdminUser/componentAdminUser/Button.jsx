import "../../output.css";
import "./ButtonColor.css";
export default function Button(props) {
  const { text, className = "", ...rest } = props;
  return (
    <button
      {...rest}
      className={`text-base text-white w-44 h-8 bg-linear-[var(--bgcolor)] rounded-3xl m-4 mt-10 hover:shadow-xl/30 ${className}`}
    >
      {text}
    </button>
  );
}
