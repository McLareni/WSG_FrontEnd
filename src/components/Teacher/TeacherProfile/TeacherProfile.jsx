import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ProfileLayout from "../../Profile/ProfileLayout";
import ProfileSection from "../../Profile/ProfileSection";
import Input from "../../UI/Input/Input";
import ProfileActions from "../../Profile/ProfileActions";
import useAuthStore from "../../../store/useAuthStore";

const TeacherProfile = () => {
  const { t } = useTranslation("tabProfile");
  const navigate = useNavigate();
  const { user } = useAuthStore();

  return (
    <ProfileLayout title={t("teacher")}>
      <ProfileSection>
        <Input
          label={t("email")}
          name="email"
          type="email"
          value={user?.email || ''}
          onChange={() => {}}
          readOnly
        />
      </ProfileSection>

      <ProfileSection>
        <div className="inputGroup">
          <Input
            label={t("firstName")}
            name="firstName"
            value={user?.first_name || ''}
            onChange={() => {}}
            readOnly
          />
          <Input
            label={t("lastName")}
            name="lastName"
            value={user?.last_name || ''}
            onChange={() => {}}
            readOnly
          />
        </div>
      </ProfileSection>

      <div className="divider"></div>

      <ProfileSection title={t("createdRooms")}>
        <ul className="roomsList">
          {user?.rooms?.map(room => (
            <li key={room.id} className="roomItem">
              <span>{room.name}</span>
              <span className={room.active ? "activeStatus" : "inactiveStatus"}>
                {t(room.active ? "active" : "inactive")}
              </span>
            </li>
          ))}
        </ul>
      </ProfileSection>

      <ProfileActions
        mode="view"
        onEdit={() => navigate("/profile/edit")}
        onChangePassword={() => navigate("/profile/password")}
      />
    </ProfileLayout>
  );
};

export default TeacherProfile;