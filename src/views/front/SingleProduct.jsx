import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function SingleProduct() {
  /* navigate 傳 state方式，此方式不適用於此情況(會導致如果輸入對應的連結卻無法產生結果)，此方式較適合用在有先後步驟的地方，例如：表單(有下一頁的那種)
  const location = useLocation();
  const product = location.state?.productData; //此處的productData是由於我們在Products.jsx中navigate所設定的變數
  

  return !product ? (
    <h2>查無產品</h2>
  ) : (
    <div className="container">
      <div className="card " style={{ width: "18rem" }}>
        <img
          src={product.imageUrl}
          className="card-img-top"
          alt={product.title}
        />
        <div className="card-body">
          <h5 className="card-title">{product.title}</h5>
          <p className="card-text">{product.description}</p>
          <p className="card-text">價格：{product.price}</p>
          <p className="card-text">
            <small className="text-body-secondary">{product.unit}</small>
          </p>
          <button type="button" className="btn btn-primary">
            查看更多
          </button>
        </div>
      </div>
    </div>
  );

    */

  const { id } = useParams();
  const [product, setProduct] = useState();

  useEffect(() => {
    const handleView = async (id) => {
      try {
        const response = await axios.get(
          `${API_BASE}/api/${API_PATH}/product/${id}`
        );
        console.log(response.data.product);
        setProduct(response.data.product);
      } catch (error) {
        console.log(error.response.data);
      }
    };
    handleView(id);
  }, [id]);

  //加入購物車功能
  const addCart = async (id, qty = 1) => {
    try {
      const data = {
        product_id: id,
        qty,
      };
      const response = await axios.post(`${API_BASE}/api/${API_PATH}/cart`, {
        data,
      });
      console.log(response.data);
    } catch (error) {
      console.log(error.response.data);
    }
  };

  return !product ? (
    <h2>查無產品</h2>
  ) : (
    <div className="container">
      <div className="card " style={{ width: "18rem" }}>
        <img
          src={product.imageUrl}
          className="card-img-top"
          alt={product.title}
        />
        <div className="card-body">
          <h5 className="card-title">{product.title}</h5>
          <p className="card-text">{product.description}</p>
          <p className="card-text">原價：{product.origin_price}</p>
          <p className="card-text">售價：{product.price}</p>

          <p className="card-text">
            <small className="text-body-secondary">單位：{product.unit}</small>
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => addCart(product.id)}
          >
            加入購物車
          </button>
        </div>
      </div>
    </div>
  );
}

export default SingleProduct;
