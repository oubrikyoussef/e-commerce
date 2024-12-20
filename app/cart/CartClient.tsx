"use client";
import { useCart } from "@/hooks/useCart";
import Button from "../components/Button";
import Container from "../components/Container";
import { Heading } from "../components/Heading";
import { RedirectionPage } from "../components/RedirectionPage";
import CartSummary from "./CartSummary";
import ProductCartTable from "./ProductCartTable";
interface ICartClient {
  isLoggedIn: boolean;
}
const CartClient: React.FC<ICartClient> = ({ isLoggedIn }) => {
  const { cartProducts, clearCart, isCartEmpty } = useCart();
  return (
    <Container>
      <div className="py-8">
        {!isCartEmpty ? (
          <>
            <Heading title={"Shopping Cart"} />
            <ProductCartTable cartProducts={cartProducts} />
            <div>
              <div className="flex flex-col sm:flex-row sm:justify-between mt-2">
                <div className="w-[90px] mt-4">
                  <Button
                    label="Clear Cart"
                    onClick={() => {
                      clearCart();
                    }}
                    outline
                    small
                  />
                </div>
                <CartSummary isLoggedIn={isLoggedIn} />
              </div>
            </div>
          </>
        ) : (
          <RedirectionPage
            heading={"Your cart is empty"}
            description={"Start Shopping"}
            href={"/"}
          />
        )}
      </div>
    </Container>
  );
};
export default CartClient;
