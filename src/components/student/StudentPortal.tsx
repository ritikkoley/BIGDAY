@@ .. @@
 import { useDataStore } from '../../stores/dataStore';
 
 // Student Components 
-import { Home } from '../student/Home';
-import { StudentProgress } from '../student/StudentProgress';
+import Home from '../student/Home';
+import Progress from '../student/Progress';
 import { StudyVault } from '../StudyVault';
 import { GradesView } from '../GradesView';
 import { AttendanceView } from '../AttendanceView';
@@ .. @@
           {activeTab === 'home' && (
             <Home />
           )}
-          {activeTab === 'progress' && (
-            <StudentProgress />
+          {activeTab === 'progress' && (
+            <Progress />
           )}
           {activeTab === 'study-vault' && (
             <StudyVault