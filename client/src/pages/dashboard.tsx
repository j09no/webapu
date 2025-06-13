import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, CheckCircle, BookOpen, Clock, Flame, PlayCircle, BarChart3, Zap, Trophy, TrendingUp, Star } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

export default function Dashboard() {
  const [showStats, setShowStats] = useState(false);

  // Static dashboard data - no database calls needed
  const stats = {
    totalQuestionsSolved: 1247,
    totalCorrectAnswers: 1098,
    studyStreak: 12,
    totalStudyTimeMinutes: 850
  };

  const accuracy = Math.round((stats.totalCorrectAnswers / stats.totalQuestionsSolved) * 100);
  const studyTimeHours = Math.round((stats.totalStudyTimeMinutes / 60) * 10) / 10;

  // Get real quiz stats from API
  const { data: quizHistory = [] } = useQuery({
    queryKey: ["/api/quiz-stats"],
    enabled: showStats
  });

  if (showStats) {
    return (
      <section className="mb-8 slide-up">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2 gradient-text">Quiz Statistics</h2>
            <p className="text-gray-400 font-medium">Your complete quiz history</p>
          </div>
          <Button 
            onClick={() => setShowStats(false)}
            className="glass-button text-white px-4 py-2 font-medium"
          >
            Back to Dashboard
          </Button>
        </div>

        <div className="space-y-4">
          {quizHistory.length === 0 ? (
            <Card className="glass-card smooth-transition">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 glass-card-subtle rounded-full flex items-center justify-center">
                  <BarChart3 className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-300 font-medium mb-2">No quiz history available yet.</p>
                <p className="text-gray-500 text-sm">Start practicing to see your stats here!</p>
              </CardContent>
            </Card>
          ) : quizHistory.map((quiz, index) => (
            <Card key={index} className="glass-card hover:bg-white/10 smooth-transition">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`w-4 h-4 rounded-full ${
                        quiz.accuracy >= 90 ? 'bg-green-400' : 
                        quiz.accuracy >= 75 ? 'bg-blue-400' : 
                        quiz.accuracy >= 60 ? 'bg-yellow-400' : 'bg-red-400'
                      } shadow-lg`}></div>
                      <span className="text-sm text-gray-400 font-medium">{quiz.date}</span>
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-white">
                      {quiz.subject} - {quiz.chapter}
                    </h3>
                    {quiz.subtopic && (
                      <p className="text-sm text-gray-400 mb-3 font-medium">
                        Subtopic: {quiz.subtopic}
                      </p>
                    )}
                    <div className="flex items-center space-x-6 text-sm">
                      <span className="text-gray-300 font-medium">
                        Score: <span className="font-bold text-white">{quiz.score}/{quiz.totalQuestions}</span>
                      </span>
                      <span className="text-gray-300 font-medium">
                        Accuracy: <span className={`font-bold ${
                          quiz.accuracy >= 90 ? 'text-green-400' : 
                          quiz.accuracy >= 75 ? 'text-blue-400' : 
                          quiz.accuracy >= 60 ? 'text-yellow-400' : 'text-red-400'
                        }`}>{quiz.accuracy}%</span>
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8 slide-up">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2 gradient-text">Dashboard</h2>
          <p className="text-gray-400 font-medium">Track your preparation progress</p>
        </div>
        <Button 
          onClick={() => setShowStats(true)}
          className="ios-button-primary flex items-center space-x-2 px-4 py-2 font-medium"
        >
          <BarChart3 className="w-4 h-4" />
          <span>View Stats</span>
        </Button>
      </div>

      {/* Enhanced Study streak banner */}
      <div className="mb-8 p-6 glass-card relative overflow-hidden group smooth-transition hover:scale-[1.02]">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-red-500/5 to-yellow-500/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 glass-card-subtle rounded-2xl flex items-center justify-center relative">
                <Flame className="w-7 h-7 text-orange-400" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-400 rounded-full flex items-center justify-center">
                  <Zap className="w-2 h-2 text-black" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1 text-white">Study Streak</h3>
                <p className="text-gray-300 font-medium">Keep up the momentum!</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold gradient-text mb-1">{stats.studyStreak}</div>
              <div className="text-sm text-gray-300 font-medium">days strong</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Card className="glass-card smooth-transition hover:scale-[1.02] hover:bg-white/10 group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center relative overflow-hidden">
                <Target className="w-6 h-6 text-green-400 relative z-10" />
                <div className="absolute inset-0 bg-green-400/10 group-hover:bg-green-400/20 transition-colors"></div>
              </div>
              <span className="text-xs text-gray-400 font-medium bg-gray-800/50 px-2 py-1 rounded-lg">Overall</span>
            </div>
            <div className="text-3xl font-bold mb-2 text-white">{accuracy}%</div>
            <p className="text-sm text-gray-400 font-medium">Accuracy Rate</p>
          </CardContent>
        </Card>

        <Card className="glass-card smooth-transition hover:scale-[1.02] hover:bg-white/10 group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center relative overflow-hidden">
                <CheckCircle className="w-6 h-6 text-blue-400 relative z-10" />
                <div className="absolute inset-0 bg-blue-400/10 group-hover:bg-blue-400/20 transition-colors"></div>
              </div>
              <span className="text-xs text-gray-400 font-medium bg-gray-800/50 px-2 py-1 rounded-lg">Total</span>
            </div>
            <div className="text-3xl font-bold mb-2 text-white">{stats.totalQuestionsSolved.toLocaleString()}</div>
            <p className="text-sm text-gray-400 font-medium">Questions Solved</p>
          </CardContent>
        </Card>

        <Card className="glass-card smooth-transition hover:scale-[1.02] hover:bg-white/10 group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-violet-500/20 flex items-center justify-center relative overflow-hidden">
                <BookOpen className="w-6 h-6 text-purple-400 relative z-10" />
                <div className="absolute inset-0 bg-purple-400/10 group-hover:bg-purple-400/20 transition-colors"></div>
              </div>
              <span className="text-xs text-gray-400 font-medium bg-gray-800/50 px-2 py-1 rounded-lg">Active</span>
            </div>
            <div className="text-3xl font-bold mb-2 text-white">8</div>
            <p className="text-sm text-gray-400 font-medium">Chapters</p>
          </CardContent>
        </Card>

        <Card className="glass-card smooth-transition hover:scale-[1.02] hover:bg-white/10 group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center relative overflow-hidden">
                <Clock className="w-6 h-6 text-yellow-400 relative z-10" />
                <div className="absolute inset-0 bg-yellow-400/10 group-hover:bg-yellow-400/20 transition-colors"></div>
              </div>
              <span className="text-xs text-gray-400 font-medium bg-gray-800/50 px-2 py-1 rounded-lg">Total</span>
            </div>
            <div className="text-3xl font-bold mb-2 text-white">{studyTimeHours}h</div>
            <p className="text-sm text-gray-400 font-medium">Study Time</p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Recent Activity */}
      <Card className="glass-card smooth-transition">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Recent Activity</h3>
            <div className="w-8 h-8 glass-card-subtle rounded-xl flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-blue-400" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 glass-card-subtle rounded-xl smooth-transition hover:bg-white/10">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">Completed Physics Chapter 12</p>
                <p className="text-xs text-gray-400 font-medium">2 hours ago • 85% accuracy</p>
              </div>
              <Trophy className="w-4 h-4 text-yellow-400" />
            </div>
            <div className="flex items-center space-x-4 p-3 glass-card-subtle rounded-xl smooth-transition hover:bg-white/10">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                <PlayCircle className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">Started Chemistry Quiz</p>
                <p className="text-xs text-gray-400 font-medium">5 hours ago • 15 questions</p>
              </div>
              <Star className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}