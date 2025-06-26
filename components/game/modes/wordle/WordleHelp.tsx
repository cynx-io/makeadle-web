export default function WordleHelp() {
  return (
    <div className="border-2 mt-20 py-4 mx-auto from-sky-950 bg-gradient-to-br to-blue-950 rounded-md sm:w-96 w-[90%]">
      <h3 className="text-center">Color Indicator</h3>
      <div className="flex gap-5 justify-center mt-5">
        <span className="flex flex-col items-center">
          <div className="bg-green-600 w-8 h-8"></div>
          <p>Correct</p>
        </span>
        <span className="flex flex-col items-center">
          <div className="bg-red-700 w-8 h-8"></div>
          <p>Incorrect</p>
        </span>
        <span className="flex flex-col items-center">
          <div className="bg-yellow-700 w-8 h-8"></div>{" "}
          {/* Changed from orange-600 to match code */}
          <p>Partial</p>
        </span>
      </div>
    </div>
  );
}
