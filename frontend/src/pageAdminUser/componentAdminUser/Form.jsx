import "../../output.css";
export default function Form({ showPass = true }) {
  return (
    <>
      <form
        action=""
        className="flex flex-col items-center gap-5 w-100 h-50 text-[#2B3674] text-sm"
      >
        <label htmlFor="" className="flex flex-col justify-center w-100 gap-5">
          FullName:
          <input
            type="text"
            className="border border-1 w-[100%] rounded-[10px] h-10"
          />
        </label>
        <label htmlFor="" className="flex flex-col justify-center w-100 gap-5">
          Email:
          <input
            type="email"
            className="border border-1 w-[100%] rounded-[10px] h-10"
          />
        </label>
        {showPass && (
          <label
            htmlFor=""
            className="flex flex-col justify-center w-100 gap-5"
          >
            Password
            <input
              type="password"
              className="border border-1 w-[100%] rounded-[10px] h-10"
            />
          </label>
        )}
      </form>
    </>
  );
}
