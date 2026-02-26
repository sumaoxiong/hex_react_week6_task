import { useEffect } from "react";
import { useNavigate } from "react-router";

function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 3000); // 3秒後跳回首頁

    // 清除計時器（避免 memory leak）
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="text-center mt-5">
      <h2>404 找不到頁面</h2>
      <p>3 秒後將自動跳回首頁...</p>
    </div>
  );
}

export default NotFound;
