export const LLMMessage = ({ content }: { content: string }) => {
  return (
    <div className="flex px-4 py-7 sm:px-6">
      <img
        className="mr-2 h-10 w-10 rounded-full sm:mr-4"
        src="https://dummyimage.com/256x256/354ea1/ffffff&text=LLM"
      />
      <div className="w-full items-start">
        <p className="max-w-3xl">{content}</p>
      </div>
    </div>
  );
};
