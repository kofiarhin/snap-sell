import { useEffect } from "react";
import { baseUrl } from "./constants/constants";

const App = () => {
useEffect(() => {
const getStatus = async () => {
try {
const res = await fetch(baseUrl);
console.log(res.ok);
} catch (error) {
console.error("Failed to fetch server status:", error);
}
};

    getStatus();

}, []);

return (
<div>
<h1 className="text-center text-4xl m-8">SnapSell</h1>
</div>
);
};

export default App;
