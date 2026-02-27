import { useState } from "react";
import axios from "axios";

//元件匯入
import ProductModal from "../components/productionModal";
import Pagination from "../components/pagination";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function Login() {
  const [formData, setFormData] = useState({
    username: "", //TEMP:測試用帳號，後續正式版需刪除
    password: "",
  });
  //const [isAuth, setIsAuth] = useState(false); //預設登入狀態為否

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    //console.log(name, value);
    setFormData((preData) => ({
      ...preData,
      [name]: value,
    }));
  };

  //登入處理
  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post(`${API_BASE}/admin/signin`, formData);
      //console.log(response.data); // TEST: 測試API串接
      const { token, expired } = response.data;
      document.cookie = `hexToken=${token};expires=${new Date(expired)};`; // 設定cookie，'hexToken為自己設定的cookie名稱'
      axios.defaults.headers.common["Authorization"] = token;

      //getProducts();

      //setIsAuth(true); //畫面登入設定變為真
    } catch (error) {
      //setIsAuth(false); //登入失敗，所以畫面要處於未登入狀態
      console.log(error.response.data);
    }
  };

  return (
    <div className="container login">
      <h1>請先登入</h1>
      <form className="form-floating" onSubmit={(e) => onSubmit(e)}>
        <div className="form-floating mb-3">
          <input
            type="email"
            className="form-control"
            name="username"
            placeholder="name@example.com"
            value={formData.username}
            onChange={(e) => handleInputChange(e)}
          />
          <label htmlFor="username">Email address</label>
        </div>
        <div className="form-floating">
          <input
            type="password"
            className="form-control"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => handleInputChange(e)}
          />
          <label htmlFor="password">Password</label>
        </div>
        <button type="submit" className="btn btn-primary w-100 mt-2">
          登入
        </button>
      </form>
    </div>
  );
}

export default Login;
