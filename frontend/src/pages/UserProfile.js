import React, { useState, useEffect } from "react";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/context";
import app from "../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import axios from "axios";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import "../styles/profile.css";

export default function UserProfile() {
  const [queryHistory, setQueryHistory] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("Select Language");
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { userData, logout } = useAuth();

  useEffect(() => {
    if (userData?._id) {
      axios
        .get(`http://localhost:5000/query-history/${userData._id}`)
        .then((response) => {
          setQueryHistory(response.data.query_history);
        })
        .catch((err) => {
          console.error("Error fetching query history:", err);
          setError("Error fetching query history.");
        });
    }
    if (selectedPhoto) {
      uploadImage();
    }
  }, [userData?._id, selectedPhoto]);

  const clearQueryHistory = () => setQueryHistory([]);

  const [languagePreference, setLanguagePreference] = useState(
    localStorage.getItem("langPref")
  );

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedPhoto(file);
    }
  };

  const uploadImage = async () => {
    setUploadError("");
    const storage = getStorage(app);
    const fileName = new Date().getTime() + selectedPhoto.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, selectedPhoto);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      },
      (error) => {
        setUploadError(
          "Could not upload image. File must be an image smaller than 2MB."
        );
        setSelectedPhoto(null);
        setImageURL(null);
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageURL(downloadURL);
        });
      }
    );
  };

  const handleProfilePicUpdate = async () => {
    if (imageURL && userData?._id) {
      const formData = { token: userData.token, photoURL: imageURL };
      try {
        const response = await fetch(
          `http://localhost:5002/api/user/update/${userData._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
            credentials: "include",
          }
        );

        const data = await response.json();

        if (response.ok) {
          console.log("Profile picture updated:", data.photoURL);
          userData.photoURL = data.photoURL;
          localStorage.setItem("userData", JSON.stringify(userData));
          setUploadError("Profile picture updated.");
        } else {
          console.log("Error updating profile picture:", data);
        }
      } catch (error) {
        console.error("Error uploading profile picture:", error);
      }
    } else {
      console.log("No photo selected or user data unavailable.");
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectLanguage = (language) => {
    if (language !== "Select Language") {
      setLanguagePreference(language);
      localStorage.setItem("langPref", language);
    }
    setSelectedLanguage(language);
    setIsOpen(false);
  };

  const handleSignOut = () => {
    console.log("User signed out");
    logout();
    navigate("/");
  };

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswords({ ...passwords, [name]: value });
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (passwords.newPassword !== passwords.confirmNewPassword) {
      setMessage("New passwords do not match.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5002/api/user/update-password/${userData._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword: passwords.currentPassword,
            password: passwords.newPassword,
            token: userData.token,
          }),
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Password updated successfully.");
        setPasswords({
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
      } else {
        setMessage(data.error || "Error updating password.");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      setMessage("Server error. Please try again.");
    }
  };

  const fetchAndDownload = async (format) => {
    try {
      const response = await fetch(
        `http://localhost:5000/query-history/${userData._id}`
      );
      const data = await response.json();

      if (!data || !data.query_history) {
        alert("No query history found.");
        return;
      }

      if (format === "csv") {
        downloadCSV(data.query_history);
      } else if (format === "json") {
        downloadJSON(data.query_history);
      }
    } catch (error) {
      console.error("Error fetching query history:", error);
    }
  };

  const downloadCSV = (data) => {
    const csvContent = [
      ["Query ID", "User Query", "GraphQL Query", "Response"],
      ...data.map((row) => [
        `"${row.queryID}"`,
        `"${row.userQuery.replace(/"/g, '""')}"`,
        `"${row.graphqlQuery.replace(/"/g, '""').replace(/\n/g, " ")}"`,
        `"${row.response.replace(/"/g, '""').replace(/\n/g, " ")}"`,
      ]),
    ]
      .map((e) => e.join(","))
      .join("\n");

    triggerDownload(csvContent, "query_history.csv", "text/csv");
  };

  const downloadJSON = (data) => {
    const jsonString = JSON.stringify(data, null, 2);
    triggerDownload(jsonString, "query_history.json", "application/json");
  };

  const triggerDownload = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div>
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
      </div>

      <div className="user-centered">
        <div className="user-profile">
          <section className="user-info">
            <div className="user-card">
              <img
                src={userData.photoURL}
                alt="Profile"
                className="profile-pic"
              />
              <div>
                <h2 className="user-name">{userData.username}</h2>
                <p className="user-email">{userData.email}</p>
              </div>
            </div>
          </section>

          <section className="query-history">
            <h3 className="history-title">Query History</h3>
            <div className="history-card">
              {queryHistory && queryHistory.length > 0 ? (
                <ul>
                  {queryHistory.map((query) => (
                    <li key={query.queryID} className="history-items">
                      <p className="item-input">
                        Your prompt: {query.userQuery}
                      </p>
                      <p className="item-graph">
                        GraphQL: {query.graphqlQuery}
                      </p>
                      <p className="item-query-date">
                        <a
                          href={"http://localhost:5001/query/" + query.queryID}
                        >
                          Shareable link for this query and response
                        </a>
                      </p>
                      <div className="history-item-buttons">
                        <button
                          className="item-button"
                          onClick={() =>
                            navigate("/query", {
                              state: { oldPrompt: query.userQuery },
                            })
                          }
                        >
                          Re-run
                        </button>
                        <button
                          className="item-button"
                          onClick={() =>
                            setQueryHistory(
                              queryHistory.filter((q) => q.id !== query.id)
                            )
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="history-unavailable">
                  No query history available.
                </p>
              )}
              <button
                className="history-clear-button"
                onClick={clearQueryHistory}
              >
                Clear All History
              </button>
            </div>
          </section>

          <section className="settings">
            <h3 className="settings-title">Account Settings</h3>
            <div className="settings-card">
              <div>
                {languagePreference ? (
                  <label>
                    Current language preference is set to: {languagePreference}
                  </label>
                ) : (
                  <label>No language preference is set.</label>
                )}
                <br />
                <label>Language Preference</label>
                <div className="dropdown-lang">
                  <button className="dropdown-trigger" onClick={toggleDropdown}>
                    {selectedLanguage}
                  </button>
                  {isOpen && (
                    <ul className="dropdown-menu">
                      <li onClick={() => selectLanguage("English")}>English</li>
                      <li onClick={() => selectLanguage("Romanian")}>
                        Romanian
                      </li>
                      <li onClick={() => selectLanguage("Spanish")}>Spanish</li>
                    </ul>
                  )}
                </div>
              </div>
              <form onSubmit={handlePasswordUpdate} className="change-pass">
                <h3>Change Password</h3>
                <label>Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  placeholder="Current Password"
                  className="pass-input"
                  value={passwords.currentPassword}
                  onChange={handleInputChange}
                  required
                />

                <label>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  placeholder="New Password"
                  className="pass-input"
                  value={passwords.newPassword}
                  onChange={handleInputChange}
                  required
                />

                <label>Confirm New Password</label>
                <input
                  type="password"
                  name="confirmNewPassword"
                  placeholder="Confirm New Password"
                  className="pass-input"
                  value={passwords.confirmNewPassword}
                  onChange={handleInputChange}
                  required
                />

                {message && <p className="message">{message}</p>}

                <button type="submit" className="export-button">
                  Update Password
                </button>
              </form>
            </div>
          </section>

          <section className="update-profile-pic">
            <h3 className="update-pic-title">Update Profile Picture</h3>
            <div className="update-pic-card">
              <img
                src={imageURL || userData.photoURL}
                alt="Profile"
                className="profile-pic-preview"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePicChange}
                className="profile-pic-input"
              />
              <button
                className="update-pic-button"
                onClick={handleProfilePicUpdate}
              >
                Update Photo
              </button>
            </div>

            {uploadError && <div className="error">{uploadError}</div>}
          </section>

          <section className="export">
            <h3 className="export-title">Export Options</h3>
            <div className="export-card">
              <button
                className="export-button"
                onClick={() => fetchAndDownload("csv")}
              >
                Download Query History (CSV)
              </button>
              <button
                className="export-button"
                onClick={() => fetchAndDownload("json")}
              >
                Download Query History (JSON)
              </button>
            </div>
          </section>

          <section className="logout">
            <Button
              classes={"white"}
              text={"Log out"}
              onClick={() => handleSignOut()}
            />
          </section>
        </div>
      </div>
    </>
  );
}
