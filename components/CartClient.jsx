"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { Button } from "./ui/button";
import getUserCountry from "js-user-country";
import { getDiscountedPrice } from "@/lib/utils";
import Image from "next/image";
import useQueryGuard from "./QueryGurd";
import UddoktaPay from "@/public/uddoktapay.svg";
import { useQueryParams } from "@/lib/useQueryParams";
import { enqueueSnackbar } from "notistack";
import { createPaymentServer } from "@/controllers/payment/createPayment";

function CartClient({ data, user, planData, access, initialSelected }) {
  const [selectedProducts, setselected] = useState(initialSelected);
  const [isLocked, setisLocked] = useState(planData?.name ? true : false);
  const [finalPrice, setfinalPrice] = useState();

  const country = getUserCountry();
  const symbol = country?.id === "BD" ? "৳" : "$";
  const { setQuery, getQuery, deleteQuery } = useQueryParams();

  useEffect(() => {
    if (planData?.name) {
      setfinalPrice(
        getDiscountedPrice(
          country?.id === "BD"
            ? planData?.price?.normalBDT
            : planData?.price?.normal,
          planData?.price?.discount
        )
      );
      return;
    } else {
      const total = selectedProducts.reduce(
        (sum, item) =>
          sum +
          (getDiscountedPrice(
            country?.id === "BD"
              ? getDiscountedPrice(item?.priceBDT, item?.discount || 0)
              : getDiscountedPrice(item?.price, item?.discount || 0),
            selectedProducts?.length > 10 && item?.discountGroup
              ? item?.discountGroup
              : 0
          ) || 0),
        0
      );
      setfinalPrice(total);
      return;
    }
  }, [selectedProducts]);

  useQueryGuard();

  const [isShowed, setisShowed] = useState(false);
  const msg = getQuery("msg");
  useEffect(() => {
    if (!isShowed) {
      if (msg?.length > 0) {
        setisShowed(true);
        enqueueSnackbar(msg);
      }
    }
    deleteQuery("msg");
  }, [isShowed, msg]);

  const createPayment = async () => {
    if (selectedProducts?.length < 1) {
      return enqueueSnackbar("Select at least 1 tool");
    }
    const res = await createPaymentServer({
      planData: planData,
      selectedTools: selectedProducts,
    });

    if (res?.error) {
      enqueueSnackbar(res?.error);
      return;
    }
    window.location.href = res?.payment_url;
  };

  return (
    <section className="w-full flex justify-center">
      <div className="max-w-[940px] relative w-full inline-flex p-5 py-10 flex-col">
        <h3 className="w-fit text-black font-bold text-3xl">Select Tools</h3>
        <div
          className="
            w-full pt-5
            grid grid-cols-2
            min-[350px]:grid-cols-3
            min-[490px]:grid-cols-4
            md:grid-cols-4
            lg:grid-cols-5
            xl:grid-cols-6
            gap-4
            pb-40
          "
        >
          {data.map((product, index) => (
            <ProductCard
              selected={selectedProducts}
              setSelected={setselected}
              access={access}
              showInfo={true}
              checkOutOff={false}
              isSelectAble={true}
              isLocked={isLocked}
              key={`product-${index}`}
              {...product}
            />
          ))}
        </div>
      </div>
      <div className="w-full bottom-0 rounded-b-none border-1 bg-white z-[9999] rounded-md fixed max-w-[940px] mx-5  px-5">
        <div className="w-full flex justify-between items-center gap-5 py-5">
          <div className="flex  justify-center -space-x-2">
            {selectedProducts?.length > 0 &&
              selectedProducts
                ?.slice(0, 4)
                .map((productSe, index) => (
                  <Image
                    key={`slect-produ-${index}`}
                    src={productSe?.thumb}
                    alt={productSe?.name}
                    width={50}
                    height={50}
                    className="rounded-xl md:block hidden shadow-lg transform transition-transform duration-300 hover:scale-110 hover:rotate-3 hover:shadow-2xl"
                  />
                ))}
            {selectedProducts?.length > 4 && (
              <span className="flex bg-black/10 w-[50px] h-[50px] backdrop-blur-xl justify-center items-center text-2xl font-semibold rounded-full text-black/20">
                {selectedProducts?.length - 4}
              </span>
            )}
          </div>
          <div className="flex gap-5 items-center">
            <Image alt="Icon" src={UddoktaPay} width={55} height={55} />{" "}
            <span className="font-bold text-xl">
              {finalPrice}
              {symbol}
            </span>
            <Button
              onClick={async () => {
                if (!user?.email) {
                  setQuery("auth", "signin");
                  return;
                }
                createPayment();
              }}
            >
              {!user?.email ? "Sign In" : "Payment"}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CartClient;
