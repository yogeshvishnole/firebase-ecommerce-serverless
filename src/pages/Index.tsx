import { useEffect } from "react";
import { useHistory } from "react-router-dom";

import { useModalContext } from "../state/modal-context";
import { useAuthContext } from "../state/auth-context";
import { products } from "../data/products";
import ProductItem from "../components/products/ProductItem";

interface Props {}

const Index: React.FC<Props> = () => {
  const { setModalType } = useModalContext();
  const {
    authState: { authUser, signoutRedirect },
  } = useAuthContext();
  const history = useHistory<{ from: string }>();
  const { state } = history.location;

  useEffect(() => {
    if (!signoutRedirect) {
      if (state?.from) {
        if (!authUser) setModalType("signin");
        else history.push(state?.from);
      }
    } else {
      history.replace("/", undefined);
    }
  }, [setModalType, state, signoutRedirect, authUser, history]);
  return (
    <div className="page--products">
      <div className="products">
        {products.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Index;
