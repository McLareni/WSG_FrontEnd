import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ProfileLayout from "../../components/Profile/ProfileLayout";
import ProfileSection from "../../components/Profile/ProfileSection";
import Input from "../../components/UI/Input/Input";
import ProfileActions from "../../components/Profile/ProfileActions";
import useAuthStore from "../../store/useAuthStore";
import TeacherRooms from "../../components/Profile/TeacherRooms";
import styles from "../../components/Profile/ProfileLayout.module.css";

const ProfileView = () => {
  const { t } = useTranslation("tabProfile");
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const isTeacher = user?.role === "teacher";
  const isStudent = user?.role === "student";

  return (
    <ProfileLayout title={t(user?.role)}>
      <ProfileSection>
        <Input
          label={t("email")}
          name="email"
          type="email"
          value={user?.email || ""}
          readOnly
        />
      </ProfileSection>

      <ProfileSection>
        <div className={styles.inputRow}>
          <Input
            label={t("firstName")}
            name="firstName"
            value={user?.first_name || ""}
            readOnly
          />
          <Input
            label={t("lastName")}
            name="lastName"
            value={user?.last_name || ""}
            readOnly
          />
        </div>
      </ProfileSection>

      {isStudent && (
        <ProfileSection className={styles.albumNumberSection}>
          <div className={styles.inputRow}>
            <div className={styles.albumNumberInput}>
              <Input
                label={t("albumNumber")}
                name="albumNumber"
                value={user?.album_number || ""}
                readOnly
              />
            </div>
          </div>
        </ProfileSection>
      )}

      {isTeacher && (
        <>
          <div className={styles.divider} />
          <TeacherRooms
            rooms={[
              { id: 1, name: "#101", active: true },
              { id: 2, name: "B202", active: false },
              { id: 4, name: "F303", active: true },
              { id: 5, name: "F303", active: true },
              { id: 6, name: "B202", active: false },
              { id: 7, name: "B202", active: false },
              { id: 8, name: "B202", active: false },

            ]}
          />
        </>
      )}

      <ProfileActions
        mode="view"
        onEdit={() => navigate("/profile/edit")}
        onChangePassword={() => navigate("/profile/password")}
      />
    </ProfileLayout>
  );
};

export default ProfileView;
