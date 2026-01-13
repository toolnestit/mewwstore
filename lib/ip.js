import axios from "axios";

export async function getIPv4() {
  const res = await axios.get(process.env.IP_API);
  return res?.data;
}
