import { ClipLoader } from "react-spinners";

const AppLoader = ({ text = "Loading...", size = 40 }) => {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        color: "#aaaaaaff",
      }}
    >
      <ClipLoader color="#0c1ff1ff" size={size} />
      <span style={{ fontSize: "16px" }}>{text}</span>
    </div>
  );
};

export default AppLoader;
