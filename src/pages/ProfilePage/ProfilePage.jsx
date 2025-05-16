import useAuthStore from "../../store/useAuthStore";
import StudentProfile from '../../components/Student/StudentProfile/StudentProfile';
import TeacherProfile from '../../components/Teacher/TeacherProfile/TeacherProfile';
import StudentProfileEdit from '../../components/Student/StudentProfileEdit/StudentProfileEdit';
import TeacherProfileEdit from '../../components/Teacher/TeacherProfileEdit/TeacherProfileEdit';
import StudentProfilePassword from '../../components/Student/StudentProfilePassword/StudentProfilePassword';
import TeacherProfilePassword from '../../components/Teacher/TecherProfilePassword/TeacherProfilePassword';

const componentMap = {
  profile: {
    teacher: TeacherProfile,
    student: StudentProfile
  },
  edit: {
    teacher: TeacherProfileEdit,
    student: StudentProfileEdit
  },
  password: {
    teacher: TeacherProfilePassword,
    student: StudentProfilePassword
  }
};

const ProfilePage = ({ mode = 'profile' }) => {
  const { user } = useAuthStore();
  const role = user?.role || 'student';
  
  const Component = componentMap[mode]?.[role] || componentMap.profile[role];
  
  return <Component />;
};

export default ProfilePage;