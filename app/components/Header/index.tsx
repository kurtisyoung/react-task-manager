import { Link } from "react-router";
import * as styles from "./Header.css";
import { useAuth } from "~/context/AuthContext";

export default function Header() {
  const { logout, isAuthenticated } = useAuth();
  return (
    <div className={styles.header}>
      <img
        src="/aritzia-logo.svg"
        alt="Aritzia"
        style={{ width: "10rem", height: "3rem" }}
      />
      <div className={styles.headerContent}>
        <h1 style={{ fontSize: "1.875rem", fontWeight: "400" }}>
          React Task Manager
        </h1>
        {isAuthenticated ? (
          <Link to="/" className={styles.headerLink} onClick={logout}>
            Log Out
          </Link>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
