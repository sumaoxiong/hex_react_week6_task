import { useEffect, useRef, useState } from "react";
import axios, { Axios } from "axios";
import "./App.css";
import * as bootstrap from "bootstrap";
import "./assets/style.css";

//元件匯入
import ProductModal from "./components/productionModal";
import Pagination from "./components/pagination";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

//將表單欄位初始化
const INITIAL_TEMPLATE_DATA = {
  id: "",
  title: "",
  category: "",
  origin_price: "",
  price: "",
  unit: "",
  description: "",
  content: "",
  is_enabled: false,
  imageUrl: "",
  imagesUrl: [],
};

function App() {
  const [formData, setFormData] = useState({
    username: "", //TEMP:測試用帳號，後續正式版需刪除
    password: "",
  });
  const [isAuth, setIsAuth] = useState(false); //預設登入狀態為否

  const [products, setProducts] = useState([]);
  const [templateProduct, setTemplateProduct] = useState(INITIAL_TEMPLATE_DATA);
  const [modalType, setModalType] = useState("");
  const [pagination, setPaination] = useState({});
  const productModalRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    //console.log(name, value);
    setFormData((preData) => ({
      ...preData,
      [name]: value,
    }));
  };

  const handleModalInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    //console.log(name, value);
    setTemplateProduct((preData) => ({
      ...preData,
      [name]: type === "checkbox" ? checked : value, //判斷checkbox是否有被勾選
    }));
  };

  // modal表單的多圖片更新
  const handleModalImageChange = (index, value) => {
    setTemplateProduct((pre) => {
      const newImage = [...pre.imagesUrl];
      newImage[index] = value;

      //TODO:可以增加優化，自動增加欄位和自動刪減欄位，教學影片 53:30
      return {
        ...pre,
        imagesUrl: newImage,
      };
    });
  };

  //新增圖片
  const HandleAddImage = () => {
    setTemplateProduct((pre) => {
      const newImage = [...pre.imagesUrl];
      newImage.push("");
      return {
        ...pre,
        imagesUrl: newImage,
      };
    });
  };

  //刪除圖片
  const HandleRemoveImage = () => {
    setTemplateProduct((pre) => {
      const newImage = [...pre.imagesUrl];
      newImage.pop();
      return {
        ...pre,
        imagesUrl: newImage,
      };
    });
  };

  //取得產品列表的資料
  const getProducts = async (page = 1) => {
    try {
      const response = await axios.get(
        `${API_BASE}/api/${API_PATH}/admin/products?page=${page}`
      );
      setProducts(response.data.products);
      setPaination(response.data.pagination);
    } catch (error) {
      console.log(error.response.data);
    }
  };

  //更新產品資料(因為更新和新增兩個的api欄位幾乎一所以將這兩個寫一起)
  const updateProduct = async (id) => {
    //預設是使用post(新增產品)
    let url = `${API_BASE}/api/${API_PATH}/admin/product`;
    let method = "post";

    //如果是在編輯模式下的話要使用put
    if (modalType === "edit") {
      url = `${API_BASE}/api/${API_PATH}/admin/product/${id}`;
      method = "put";
    }

    const productData = {
      data: {
        ...templateProduct,
        origin_price: Number(templateProduct.origin_price),
        price: Number(templateProduct.price),
        is_enabled: templateProduct.is_enabled ? 1 : 0,
        imagesUrl: [...templateProduct.imagesUrl.filter((url) => url !== "")], //url不為空，就傳回新的陣列
      },
    };

    try {
      const response = await axios[method](url, productData);
      console.log(response.data);
      getProducts();
      closeModule();
    } catch (error) {
      console.log(error.response.data);
    }
  };

  //刪除產品
  const delProduct = async (id) => {
    try {
      const response = await axios.delete(
        `${API_BASE}/api/${API_PATH}/admin/product/${id}`
      );
      console.log(response.data);
      getProducts(); //更新產品列表資訊
      closeModule(); //關閉表單
    } catch (error) {
      console.log(error.response.data);
    }
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

      getProducts();

      setIsAuth(true); //畫面登入設定變為真
    } catch (error) {
      setIsAuth(false); //登入失敗，所以畫面要處於未登入狀態
      console.log(error.response.data);
    }
  };

  useEffect(() => {
    //取得cookie的值(登入的cookie)
    const token = document.cookie
      .split("; ") // 將整串 cookie 字串以 "; " 切割成陣列，例如：["hexToken=abc123", "otherCookie=xyz"]
      .find((row) => row.startsWith("hexToken=")) // 從陣列中找到開頭為 "hexToken=" 的那筆資料，例如: "hexToken=abc123"
      ?.split("=")[1]; //再以 "=" 切割，取索引 [1] 的值（也就是 token 本身），例如: "abc123"
    if (token) {
      axios.defaults.headers.common["Authorization"] = token;
    }

    productModalRef.current = new bootstrap.Modal("#productModal", {
      keyboard: false,
    });

    const checkLogin = async () => {
      try {
        const response = await axios.post(`${API_BASE}/api/user/check`);
        console.log(response.data);
        setIsAuth(true); //將登入狀態變成‘真’
        getProducts(); //取得資料
      } catch (error) {
        console.log(error.response?.data);
      }
    };

    checkLogin();
  }, []);

  //表單顯示的設定
  const openModule = (type, product) => {
    //console.log(product);
    setModalType(type);
    setTemplateProduct((pre) => ({
      ...pre,
      ...product,
    }));
    productModalRef.current.show();
  };

  //關閉標單顯示的設定
  const closeModule = () => {
    productModalRef.current.hide();
  };

  return (
    <>
      {!isAuth ? (
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
      ) : (
        <div className="container">
          <h2>產品列表</h2>
          <div className="text-end mt-4">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => openModule("create", INITIAL_TEMPLATE_DATA)}
            >
              建立新的產品
            </button>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>分類</th>
                <th>產品名稱</th>
                <th>原價</th>
                <th>售價</th>
                <th>是否啟用</th>
                <th>編輯</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item) => (
                <tr key={item.id}>
                  <td>{item.category}</td>
                  <td scope="row">{item.title}</td>
                  <td>{item.origin_price}</td>
                  <td>{item.price}</td>
                  <td className={`${item.is_enabled && "text-success"}`}>
                    {item.is_enabled ? "啟用" : "未啟用"}
                  </td>
                  <td>
                    <div
                      className="btn-group"
                      role="group"
                      aria-label="Basic example"
                    >
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => openModule("edit", item)}
                      >
                        編輯
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => openModule("delete", item)}
                      >
                        刪除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination pagination={pagination} onChangePage={getProducts} />
        </div>
      )}

      <ProductModal
        modalType={modalType}
        templateProduct={templateProduct}
        handleModalImageChange={handleModalImageChange}
        handleModalInputChange={handleModalInputChange}
        HandleAddImage={HandleAddImage}
        HandleRemoveImage={HandleRemoveImage}
        delProduct={delProduct}
        closeModule={closeModule}
        updateProduct={updateProduct}
      />
    </>
  );
}

export default App;
