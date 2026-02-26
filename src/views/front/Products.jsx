import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function Products() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axios.get(
          `${API_BASE}/api/${API_PATH}/products`
        );
        console.log(response.data.products);
        setProducts(response.data.products);
      } catch (error) {
        console.log(error.response.data);
      }
    };
    getProducts();
  }, []);

  const handleView = async (id) => {
    /*  navigate 傳 state方式，此方式不適用於此情況(會導致如果輸入對應的連結卻無法產生結果)，此方式較適合用在有先後步驟的地方，例如：表單(有下一頁的那種)
    try {
      const response = await axios.get(
        `${API_BASE}/api/${API_PATH}/product/${id}`
      );
      console.log(response.data.product);
      navigate(`/product/${id}`, {
        state: {
          productData: response.data.product,
        },
      });
    } catch (error) {
      console.log(error.response.data);
    } */

    navigate(`/product/${id}`);
  };

  return (
    <div className="container">
      <div className="row">
        {products.map((product) => (
          <div className="col-md-4 mb-3" key={product.id}>
            <div className="card ">
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
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleView(product.id)}
                >
                  查看更多
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
