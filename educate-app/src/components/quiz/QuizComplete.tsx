interface QuizCompleteProps {
  score: { correct: number; total: number };
}

export function QuizComplete({ score }: QuizCompleteProps) {
  return (
    <div className="bg-emerald-500/10 border border-emerald-500 rounded-xl p-4 text-center">
      <p className="text-emerald-400 font-bold m-0">
        &#127881; Done! {score.correct}/{score.total} correct
      </p>
    </div>
  );
}
