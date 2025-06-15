import { useRef, useState } from "react";
import styles from "./ImagePicker.module.css";

const ImagePicker = ({ setPhoto }) => {
  const [imagePicker, setImagePicker] = useState(false);
  const inputRef = useRef();

  const [imageUrl, setImageUrl] = useState(null);

  const handleFileChange = (e) => {
    console.log(e);

    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageUrl(event.target.result);
        setPhoto(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className={styles.imagePicker}
      onMouseEnter={() => setImagePicker(true)}
      onMouseLeave={() => setImagePicker(false)}
      onClick={() => inputRef?.current.click()}
    >
      <input
        accept="image/*"
        hidden
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
      />
      {imagePicker && <h2>Select photo</h2>}
      {imageUrl && <img src={imageUrl} alt="Uploaded" />}
    </div>
  );
};

export default ImagePicker;
