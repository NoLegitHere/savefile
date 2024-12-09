import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [files, setFiles] = useState([]);
  const [file, setFile] = useState(null);

  // Lấy danh sách file
  useEffect(() => {
    axios.get("http://localhost:5000/files").then((res) => {
      setFiles(res.data);
    });
  }, []);

  // Upload file
  const uploadFile = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    await axios.post("http://localhost:5000/upload", formData);
    alert("File uploaded successfully");
    window.location.reload();
  };

  return (
    <div>
      <h1>Lưu trữ files</h1>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button onClick={uploadFile}>Tải lên</button>

      <h2>Tệp</h2>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên file</th>
            <th>Đăng lên vào</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr key={file.id}>
              <td>{file.id}</td>
              <td>{file.name}</td>
              <td>{new Date(file.uploaded_at).toLocaleString()}</td>
              <td>
                <a href={`http://localhost:5000/download/${file.id}`} download>
                  Tải về
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
