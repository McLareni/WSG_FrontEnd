import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ProfileLayout from "../../Profile/ProfileLayout";
import ProfileSection from "../../Profile/ProfileSection";
import Input from "../../UI/Input/Input";
import ProfileActions from "../../Profile/ProfileActions";
import useAuthStore from "../../../store/useAuthStore";

const StudentProfile = () => {
  const { t } = useTranslation("tabProfile");
  const navigate = useNavigate();
  const { user } = useAuthStore();

  return (
    <ProfileLayout title={t("student")}>
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
        <Input
          label={t("firstName")}
          name="firstName"
          value={user?.first_name || ''}
          onChange={() => {}}
          readOnly
        />
      </ProfileSection>

      <ProfileSection>
        <Input
          label={t("lastName")}
          name="lastName"
          value={user?.last_name || ''}
          onChange={() => {}}
          readOnly
        />
      </ProfileSection>

      <ProfileSection>
        <Input
          label={t("albumNumber")}
          name="albumNumber"
          value={user?.album_number || ''}
          onChange={() => {}}
          readOnly
        />
      </ProfileSection>

      <ProfileActions
        mode="view"
        onEdit={() => navigate("/profile/edit")}
        onChangePassword={() => navigate("/profile/password")}
      />
    </ProfileLayout>
  );
};

export default StudentProfile;