
type CourseProgressProps = {
  videosWatched: number;
  totalVideos: number;
  quizzesCompleted: number;
  totalQuizzes: number;
  labsCompleted: number;
  totalLabs: number;
};

const CourseProgress = ({
  videosWatched,
  totalVideos,
  quizzesCompleted,
  totalQuizzes,
  labsCompleted,
  totalLabs,
}: CourseProgressProps) => {
  return (
    <div className="bg-white w-full h-fit rounded-2xl p-4">
      <h2 className="text-lg font-semibold mb-3">Course Progress</h2>
      <ul className="space-y-2 text-sm">
        <li className="flex justify-between">
          <span>Videos Watched</span>
          <span>{videosWatched}/{totalVideos}</span>
        </li>
        <li className="flex justify-between">
          <span>Quizzes Completed</span>
          <span>{quizzesCompleted}/{totalQuizzes}</span>
        </li>
        <li className="flex justify-between">
          <span>Lab Exercises</span>
          <span>{labsCompleted}/{totalLabs}</span>
        </li>
      </ul>
    </div>
  );
};

export default CourseProgress;
