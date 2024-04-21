export const UserMessage = ({ content }: { content: string }) => {
  return (
    <div
      className="flex px-4 py-8 sm:px-6 items-center
      rounded-md border shadow-sm shadow-primary"
    >
      <img
        className="mr-2 h-10 w-10 rounded-full sm:mr-4"
        src="https://dummyimage.com/256x256/363536/ffffff&text=U"
      />
      <div className="max-w-3xl">
        <p>{content}</p>
      </div>
    </div>
  );
};
