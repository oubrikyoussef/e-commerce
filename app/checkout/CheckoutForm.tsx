"use client";
import { useCart } from "@/hooks/useCart";
import {
  AddressElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import toast from "react-hot-toast";
import Button from "../components/Button";
import { formatPrice } from "../utils/functions/numbers";

export const CheckoutForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    cartTotalAmount,
    clearCart,
    handleSetPaymentIntentId,
    paymentIntentId,
  } = useCart();
  const stripe = useStripe();
  const elements = useElements();
  if (!stripe || !elements) return;

  const formattedPrice = formatPrice(cartTotalAmount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });
    if (result.error)
      throw new CheckoutError("Error while trying to confirm payment");

    try {
      const response = await fetch("/api/order/paymentStatus", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentIntentId }),
      });
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new CheckoutError(
          errorResponse.error || "Unknown error occurred",
          errorResponse.status
        );
      }
    } catch (error) {
      //promise not resolved (CORS/network/type error)
      console.error("An unexpected error occurred", error);
      throw new Error("An unexpected error occurred");
    }
    toast.success("Checkout success");
    clearCart();
    handleSetPaymentIntentId("");
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} id="payment-form">
      <h2 className="text-center mb-2">
        Enter payment details to complete checkout
      </h2>
      <p className="mb-1">Address informations</p>
      <AddressElement
        id="address-element"
        options={{
          mode: "shipping",
        }}
      />
      <p className="my-1">Payment informations</p>
      <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
      <Button
        label={isLoading ? "Processing..." : `Pay ${formattedPrice}`}
        disabled={isLoading || !stripe || !elements}
        onClick={() => {}}
        customClass="mt-2"
      />
    </form>
  );
};
