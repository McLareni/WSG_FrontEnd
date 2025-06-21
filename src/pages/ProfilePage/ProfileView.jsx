import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import ProfileLayout from "../../components/Profile/ProfileLayout";
import ProfileSection from "../../components/Profile/ProfileSection";
import ProfileActions from "../../components/Profile/ProfileActions";
import Input from "../../components/UI/Input/Input";
import TeacherRooms from "../../components/Profile/TeacherRooms";

import useAuthStore from "../../store/useAuthStore";
import styles from "../../components/Profile/ProfileLayout.module.css";

const devButtonStyle = {
  position: "fixed",
  bottom: "20px",
  right: "20px",
  zIndex: 1000,
  padding: "10px 15px",
  backgroundColor: "#ff4444",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "14px",
  boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
  transition: "all 0.3s ease",
  ":hover": {
    backgroundColor: "#cc0000",
  },
};

const ProfileView = () => {
  const { t } = useTranslation("tabProfile");
  const navigate = useNavigate();
  const { user, getTeacherRooms, logout } = useAuthStore();

  const isTeacher = user?.role === "teacher";
  const isStudent = user?.role === "student";

  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [roomsError, setRoomsError] = useState(null);

  useEffect(() => {
    console.log("Current user object:", user);
    const fetchRooms = async () => {
      try {
        setLoadingRooms(true);
        setRoomsError(null);

        const result = await getTeacherRooms();

        if (result.success) {
          setRooms(result.data);
        } else {
          setRoomsError(result.error || t("errors.fetchRoomsFailed"));
        }
      } catch (err) {
        console.error("Помилка завантаження кімнат:", err);
        setRoomsError(t("errors.fetchRoomsFailed"));
      } finally {
        setLoadingRooms(false);
      }
    };

    if (isTeacher && user?.id) {
      fetchRooms();
    }
  }, [isTeacher, user?.id, t, getTeacherRooms]);

  return (
    <ProfileLayout title={t(user?.role || "profile")}>
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
        <ProfileSection>
          <Input
            label={t("albumNumber")}
            name="albumNumber"
            value={user?.album_number || ""}
            readOnly
          />
        </ProfileSection>
      )}

      {isTeacher && (
        <TeacherRooms rooms={rooms} loading={loadingRooms} error={roomsError} />
      )}

      <ProfileActions
        mode="view"
        onEdit={() => navigate("/profile/edit")}
        onChangePassword={() => navigate("/profile/password")}
      />
      <button onClick={logout} style={devButtonStyle} title="Тестовий логаут">
        {t("logout")}
      </button>
    </ProfileLayout>
  );
};

export default ProfileView;
