import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AccountPage, HelpPage } from './pages/Account';
import { AnalyticsPage } from './pages/Analytics';
import { BuddyPage } from './pages/Buddy';
import { CareerDetailPage, CareerPage } from './pages/Career';
import { DashboardPage } from './pages/Dashboard';
import { ExamDetailPage, ExamPage, SprintPage } from './pages/Exam';
import { ChapterPage, LearningPage, SubjectPage, SubjectsPage } from './pages/Learning';
import { MaterialListPage, MaterialPage, MaterialsPage, PackPage } from './pages/Materials';
import { MentorPage } from './pages/Mentor';
import { MotivationPage } from './pages/Motivation';
import { PlannerPage } from './pages/Planner';
import { PracticePage, PracticeSubjectPage, TestPage } from './pages/Practice';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route path="learning" element={<LearningPage />} />
        <Route path="subjects" element={<SubjectsPage />} />
        <Route path="subjects/:sid" element={<SubjectPage />} />
        <Route path="subjects/:sid/:n" element={<ChapterPage />} />
        <Route path="materials" element={<MaterialsPage />} />
        <Route path="materials/:kind" element={<MaterialListPage />} />
        <Route path="materials/:kind/:sid/:n" element={<MaterialPage />} />
        <Route path="pack/:sid" element={<PackPage />} />
        <Route path="practice" element={<PracticePage />} />
        <Route path="practice/:sid" element={<PracticeSubjectPage />} />
        <Route path="test" element={<TestPage />} />
        <Route path="exam" element={<ExamPage />} />
        <Route path="exam/sprint" element={<SprintPage />} />
        <Route path="exam/:id" element={<ExamDetailPage />} />
        <Route path="buddy" element={<BuddyPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="planner" element={<PlannerPage />} />
        <Route path="motivation" element={<MotivationPage />} />
        <Route path="career" element={<CareerPage />} />
        <Route path="career/:id" element={<CareerDetailPage />} />
        <Route path="mentor" element={<MentorPage />} />
        <Route path="account" element={<AccountPage />} />
        <Route path="help" element={<HelpPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
