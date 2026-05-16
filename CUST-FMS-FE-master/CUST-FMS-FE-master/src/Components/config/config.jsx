
import { useUser } from "../context/UserContext";

export default function Config() {
  const { token } = useUser();
  console.log(token);
  return {
    headers: { Accept: 'application/json', Authorization: `Bearer ${token}` }
  }
}

const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

export { baseUrl, Config }
