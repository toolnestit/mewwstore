"use client";

import { useQueryParams } from "@/lib/useQueryParams";
import { CreditCard, Info, Loader2, LogOut, User, X } from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { closeSnackbar, enqueueSnackbar } from "notistack";
import { useCallback, useEffect, useState } from "react";
import { AnimatedCircularProgressBar } from "./ui/animated-circular-progress-bar";
import { FaCircleCheck } from "react-icons/fa6";
import Input from "./ui/Input";
import { Button } from "./ui/button";
import { getSubscriptionHistory, updateUser } from "@/controllers/basics/user";
import { useRouter } from "next/navigation";

function Account({ session }) {
  const { deleteQuery, hasQuery } = useQueryParams();
  const [orders, setorders] = useState([]);
  const [tab, setTab] = useState("account");
  const [loader, setloader] = useState();
  const router = useRouter();
  const isOpen = hasQuery("account");

  const getOrder = useCallback(async () => {
    const orders = await getSubscriptionHistory();
    console.log(orders);
    setorders(orders);
  });

  useEffect(() => {
    getOrder();
  }, []);

  const handleClose = () => {
    if (session?.progress < 100) {
      enqueueSnackbar({
        message: "Complete your profile first",
        action: <Info strokeWidth={2} className="mr-2" size={20} />,
      });
      return;
    }
    deleteQuery("account");
  };

  const handelUpdate = async (e) => {
    e.preventDefault();

    if (loader) {
      return;
    }

    const form = e.target;
    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const email = form.email?.value?.trim(); // disabled but still available

    // Validation errors array
    const errors = [];

    if (!name) errors.push("Name is required.");
    else if (name.length < 3)
      errors.push("Name must be at least 3 characters.");

    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phone) errors.push("Phone number is required.");
    else if (!phoneRegex.test(phone))
      errors.push("Phone number must be 10–15 digits.");

    if (errors.length > 0) {
      errors.forEach((msg) =>
        enqueueSnackbar({
          variant: "error",
          message: msg,
          action: <Info size={20} strokeWidth={1.5} />,
        })
      );
      return;
    }
    setloader(true);
    const res = await updateUser(name, phone);
    setloader(false);
    if (!res?.success) {
      enqueueSnackbar({
        variant: "error",
        message: res?.msg,
        action: <Info size={20} strokeWidth={1.5} />,
      });
      return;
    }
    deleteQuery("account");
    router.refresh();
    enqueueSnackbar({
      variant: "success",
      message: res?.msg,
      action: <Info size={20} strokeWidth={1.5} />,
    });
  };

  const comp = (
    <section className="flex justify-center w-full items-center backdrop-blur-[8px] bg-black/20 h-screen fixed top-0 px-5 z-[99]">
      <div className="bg-white max-w-[700px] flex flex-col gap-7 p-7 w-full rounded-md">
        {/* Header */}
        <div className="flex justify-between">
          <div className="flex items-center gap-3 w-fit">
            <AnimatedCircularProgressBar
              max={100}
              min={0}
              value={session?.progress}
              gaugePrimaryColor="black"
              gaugeSecondaryColor="rgba(0, 0, 0, 0.1)"
            >
              <Image
                unoptimized
                src={`/api/og/avatar?q=${session?.email ?? "U"}`}
                width={29}
                height={29}
                alt="Avatar"
                className="rounded-full absolute  bg-black/10"
              />
              {session?.progress === 100 && (
                <FaCircleCheck
                  size={15}
                  className=" absolute text-sky-500 bg-white rounded-full translate-y-3 translate-x-3 z-20"
                />
              )}
            </AnimatedCircularProgressBar>
            <h2 className="text-xl font-semibold">Account</h2>
          </div>

          <button onClick={handleClose} className="cursor-pointer">
            <X size={25} />
          </button>
        </div>

        {/* Tabs */}
        <div>
          <ul className="gap-5 w-full flex flex-wrap">
            <button
              onClick={() => setTab("account")}
              className={`flex items-center text-sm gap-2 border rounded-md cursor-pointer py-2 px-5  grow ${
                tab === "account"
                  ? "text-black border-black/30 ring ring-offset-2"
                  : "text-black/50 hover:bg-black/5"
              }`}
            >
              <User size={20} /> Account
            </button>

            <button
              onClick={() => setTab("subscription")}
              className={`flex items-center text-sm gap-2 border rounded-md cursor-pointer py-2 px-5 grow ${
                tab === "subscription"
                  ? "text-black border-black/30 ring ring-offset-2"
                  : "text-black/50 hover:bg-black/5"
              }`}
            >
              <CreditCard size={20} /> Subscription
            </button>

            <button
              onClick={() => {
                enqueueSnackbar({
                  message: "Are you sure?",
                  action: (
                    <>
                      <button
                        onClick={() => {
                          signOut();
                        }}
                        className="px-5 border-r border-white/20 text-sky-600 cursor-pointer"
                      >
                        Logout
                      </button>
                      <button
                        onClick={() => {
                          closeSnackbar();
                        }}
                        className="px-5  text-red-600 cursor-pointer"
                      >
                        No
                      </button>
                    </>
                  ),
                });
              }}
              className="flex items-center text-sm gap-2 border rounded-md cursor-pointer py-2 px-5 text-black/50 hover:bg-black/5 grow"
            >
              <LogOut strokeWidth={1.5} size={20} /> Logout
            </button>
          </ul>
        </div>

        {/* Tab Content */}
        <div className="mt-4">
          {tab === "account" && (
            <div>
              <fieldset className="rounded-md pt-4">
                <legend className="px-2 text-gray-700 font-medium">
                  Personal Details
                </legend>

                <form
                  onSubmit={handelUpdate}
                  className="grid grid-cols-2 w-full justify-between px-2 gap-5"
                >
                  <Input
                    defaultValue={session?.name}
                    placeholder="Name"
                    className="w-full"
                    name="name"
                    required
                    size="sm"
                  />
                  <Input
                    placeholder="Phone"
                    required
                    className="w-full"
                    defaultValue={session?.phoneNumber}
                    name="phone"
                    type="tel"
                    size="sm"
                  />
                  <Input
                    disabled
                    defaultValue={session?.email}
                    placeholder="Email"
                    className="w-full"
                    parentClassName="col-span-2"
                    size="sm"
                    required
                  />
                  <div className="w-full col-span-2 flex ">
                    <Button disabled={loader}>Save</Button>
                  </div>
                </form>
              </fieldset>
            </div>
          )}

          {tab === "subscription" && (
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {orders.length === 0 && (
                <p className="text-center text-sm text-black/50">
                  No subscription history found
                </p>
              )}

              {orders.map((order) => {
                const meta = JSON.parse(order.metadata || "{}");

                return (
                  <div
                    key={`orders-${Math.random(128812 * 23772)}`}
                    className="border rounded-xl p-4 bg-black/[0.02]  transition"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-black">
                          ৳{Number(order.pricePaid).toFixed(0)}
                        </p>
                        <p className="text-xs text-black/50">
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>

                      <span
                        className={`text-xs px-3 py-1 rounded-full ${
                          order.status === "COMPLETED"
                            ? "bg-green-500/10 text-green-600"
                            : "bg-yellow-500/10 text-yellow-600"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-black/70">
                      <div>
                        <span className="block text-xs text-black/40">
                          Transaction ID
                        </span>
                        <span className="font-mono text-black">
                          {meta.transaction_id || "N/A"}
                        </span>
                      </div>

                      <div>
                        <span className="block text-xs text-black/40">
                          Payment Method
                        </span>
                        <span className="capitalize">
                          {meta.payment_method || order.paymentMethod}
                        </span>
                      </div>

                      <div>
                        <span className="block text-xs text-black/40">
                          Expire Date
                        </span>
                        <span>
                          {new Date(order.expireAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );

  // Always show modal if user hasn't finished profile
  if (session?.progress < 100) return comp;

  return isOpen ? comp : null;
}

export default Account;
